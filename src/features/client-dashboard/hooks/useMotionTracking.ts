// src/features/client-dashboard/hooks/useMotionTracking.ts
import { useRef, useState, useCallback, useEffect } from 'react';
import { Results } from '@mediapipe/pose';
import {
  analyzeForm,
  computeAngleForRule,
  detectWrongExercise,
  JointRule,
  RepROM,
  VISIBILITY_THRESHOLD,
  LANDMARK_CLEAR_THRESHOLD,
  JOINT_GROUPS,
  ROM_STANDARDS,
} from '@/features/shared/utils/motion';
import { classifyDirection, type MovementDirection } from '@/lib/tracking/AngleEngine';
import { RepStateMachine } from '@/lib/tracking/RepStateMachine';
import { MOVEMENT_PRIMARY_DIR } from '@/lib/tracking/LandmarkMap';

interface MotionSnapshot {
  timestamp: number;
  landmarks: any[];
}

// Number of frames in the rolling wrong-exercise detection window (~3 seconds at 30fps)
const DETECTION_WINDOW = 90;

export function useMotionTracking(
  correctAngles?: JointRule[],
  trackingConfig?: any,
  activeSide?: 'left' | 'right',
  holdSeconds?: number,
) {
  // Override bilateral rules with the user-selected side
  const resolvedAngles = correctAngles?.map(r =>
    activeSide && (!r.side || r.side === 'bilateral')
      ? { ...r, side: activeSide }
      : r,
  );
  const [formScore,           setFormScore]           = useState<number>(0);
  const [feedback,            setFeedback]            = useState<string>('');
  const [repCount,            setRepCount]            = useState<number>(0);
  const [lastROM,             setLastROM]             = useState<RepROM | null>(null);
  const [currentAngle,        setCurrentAngle]        = useState<number | null>(null);
  const [currentAngles,       setCurrentAngles]       = useState<Record<string, number>>({});
  const [wrongExerciseWarning,setWrongExerciseWarning]= useState<string | null>(null);
  const [velocity,            setVelocity]            = useState<number>(0);
  const [direction,           setDirection]           = useState<MovementDirection>('neutral');
  const [repPhase,            setRepPhase]            = useState<string>('IDLE');
  const [holdProgress,        setHoldProgress]        = useState<number>(0);
  const [holdElapsedMs,       setHoldElapsedMs]       = useState<number>(0);
  const [holdRequiredMs,      setHoldRequiredMs]      = useState<number>(0);

  const snapshots           = useRef<MotionSnapshot[]>([]);
  const frameCount          = useRef(0);
  const smRef               = useRef<RepStateMachine | null>(null);
  const correctAnglesRef    = useRef(resolvedAngles);
  correctAnglesRef.current  = resolvedAngles;
  const trackingConfigRef   = useRef(trackingConfig);
  trackingConfigRef.current = trackingConfig;
  const activeSideRef       = useRef(activeSide);
  activeSideRef.current     = activeSide;

  type RepPhase = 'ready' | 'down' | 'up';
  const repPhaseRef = useRef<RepPhase>('ready');

  const angleBufferRef      = useRef<number[]>([]);
  const prevAngleRef        = useRef<number | null>(null);
  const prevAngleAtRef      = useRef<number | null>(null);
  const SMOOTHING_FRAMES    = 5;

  // Throttle live UI state updates to ~10 Hz. Rep counting itself still runs
  // every frame (catches angle crossings); only the React setState calls that
  // drive on-screen numbers (angle, phase, hold timer, velocity, direction)
  // are coalesced to avoid re-rendering the parent tree 30× per second.
  const LIVE_UI_INTERVAL_MS = 100;
  const lastLiveFlushRef    = useRef<number>(0);
  const pendingLiveRef      = useRef<{
    angle: number | null;
    phase: string;
    holdProgress: number;
    holdElapsedMs: number;
    velocity: number;
    direction: MovementDirection;
  } | null>(null);

  // Rolling angle history for each joint group — used by wrong-exercise detector
  const angleHistoryRef = useRef<Record<string, number[]>>(
    Object.fromEntries(Object.keys(JOINT_GROUPS).map((g) => [g, []])),
  );

  // (Re-)initialise state machine whenever exercise, side, or hold changes
  useEffect(() => {
    const repRule = resolvedAngles?.find(
      (r) => r.rep_joint && r.up_threshold != null && r.down_threshold != null,
    );
    if (repRule) {
      const primaryDir = MOVEMENT_PRIMARY_DIR[repRule.movement ?? ''] ?? 'down';
      smRef.current = new RepStateMachine(
        repRule.up_threshold!,
        repRule.down_threshold!,
        holdSeconds ?? 0,
        primaryDir,
      );
      setHoldRequiredMs((holdSeconds ?? 0) * 1000);
    } else {
      smRef.current = null;
    }
    angleBufferRef.current = [];
    prevAngleRef.current = null;
    prevAngleAtRef.current = null;
    pendingLiveRef.current = null;
    lastLiveFlushRef.current = 0;
    setRepCount(0);
    setLastROM(null);
    setCurrentAngle(null);
    setCurrentAngles({});
    setWrongExerciseWarning(null);
    setDirection('neutral');
    setRepPhase('IDLE');
    setHoldProgress(0);
    setHoldElapsedMs(0);
    angleHistoryRef.current = Object.fromEntries(
      Object.keys(JOINT_GROUPS).map((g) => [g, []]),
    );
  }, [correctAngles, activeSide, holdSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

  // Determine which joint group the exercise targets (for wrong-exercise detection)
  const targetGroupRef = useRef<string | null>(null);
  useEffect(() => {
    const repRule = resolvedAngles?.find((r) => r.rep_joint);
    if (repRule?.movement) {
      const std = ROM_STANDARDS[repRule.movement];
      targetGroupRef.current = std?.joint_group ?? null;
    } else {
      targetGroupRef.current = null;
    }
  }, [correctAngles, activeSide]); // eslint-disable-line react-hooks/exhaustive-deps

  const smoothAngle = useCallback((raw: number): number => {
    const buf = angleBufferRef.current;
    buf.push(raw);
    if (buf.length > SMOOTHING_FRAMES) buf.shift();
    return buf.reduce((a, b) => a + b, 0) / buf.length;
  }, []);

  const clampToPhysiological = useCallback((angle: number, movementKey?: string): number | null => {
    if (!movementKey) return angle;
    const standard = ROM_STANDARDS[movementKey];
    if (!standard) return angle;
    if (angle < standard.min - 5 || angle > standard.max + 15) return null;
    return angle;
  }, []);

  const countCompositeRep = useCallback((angle: number): void => {
    const config = trackingConfigRef.current;
    if (!config?.down || !config?.up || config.mode !== 'composite') return;

    // Use first joint's threshold for a single representative angle
    const downThresholds = Object.values(config.down) as string[];
    const upThresholds   = Object.values(config.up)   as string[];
    if (!downThresholds.length || !upThresholds.length) return;

    const parseThreshold = (t: string) => ({
      op:  t.startsWith('<') ? '<' : '>',
      val: parseInt(t.replace(/[<>]/g, ''), 10),
    });

    const meetsDown = downThresholds.every((t) => {
      const { op, val } = parseThreshold(t);
      return op === '<' ? angle < val : angle > val;
    });

    const meetsUp = upThresholds.every((t) => {
      const { op, val } = parseThreshold(t);
      return op === '<' ? angle < val : angle > val;
    });

    if (repPhaseRef.current === 'ready' && meetsDown) {
      repPhaseRef.current = 'down';
    } else if (repPhaseRef.current === 'down' && meetsUp) {
      repPhaseRef.current = 'up';
      setRepCount((r) => r + 1);
      repPhaseRef.current = 'ready';
    }
  }, []);

  const processResults = useCallback((results: Results) => {
    if (!results.poseLandmarks) return;

    frameCount.current++;
    const lm = results.poseLandmarks;
    // Metric 3D landmarks — available on every Results object from @mediapipe/pose.
    // Routed into computeAngleForRule only when the movement is flagged
    // `use_3d` in ROM_STANDARDS (sagittal flex/ext, IR/ER, spine rotation).
    const wlm = results.poseWorldLandmarks;

    // ── 1. Rep counting (every frame — catches angle crossings) ──────────
    const repRule = correctAnglesRef.current?.find(
      (r) => r.rep_joint && r.up_threshold != null && r.down_threshold != null,
    );

    if (repRule && smRef.current) {
      const triplet: [number, number, number] = Array.isArray(repRule.landmarks)
        ? repRule.landmarks as [number, number, number]
        : [repRule.landmarks[0], repRule.landmarks[1], repRule.landmarks[2]];

      const side     = repRule.side ?? 'bilateral';
      const use3D    = !!(repRule.movement && ROM_STANDARDS[repRule.movement]?.use_3d);
      const rawAngle = computeAngleForRule(lm, triplet, side, wlm, use3D);
      // Clamp to physiological range BEFORE smoothing + state-machine update —
      // a single-frame MediaPipe glitch past the joint's anatomical max can
      // otherwise trip PEAK spuriously and record a false rep.
      const cleanAngle = rawAngle !== null
        ? clampToPhysiological(rawAngle, repRule.movement)
        : null;
      const angle = cleanAngle !== null ? smoothAngle(cleanAngle) : null;

      if (angle !== null) {
        const repCompleted = smRef.current.update(angle);
        const s = smRef.current.stats;

        if (repCompleted) {
          setRepCount(s.repCount);
          // Expose last rep as a min/max ROM pair (compatible with existing UI)
          const peak = s.lastRep?.peakAngle ?? angle;
          const rest = repRule.down_threshold!;
          setLastROM({ min: Math.min(peak, rest), max: Math.max(peak, rest) });
        }

        // Stage live values into a pending ref; flush below on a fixed cadence.
        // Velocity is degrees per SECOND, computed from the timestamp delta so
        // it stays honest if frame rate drifts (device slowdowns, model swaps).
        const now = Date.now();
        let velocity = 0;
        if (prevAngleRef.current !== null && prevAngleAtRef.current !== null) {
          const dtMs = now - prevAngleAtRef.current;
          // Guard against 0 and absurdly stale deltas (e.g. tab was backgrounded).
          if (dtMs > 0 && dtMs < 500) {
            velocity = Math.round(((angle - prevAngleRef.current) * 1000) / dtMs);
          }
        }
        prevAngleRef.current = angle;
        prevAngleAtRef.current = now;

        const direction: MovementDirection =
          (repRule.movement && repRule.down_threshold != null)
            ? classifyDirection(repRule.movement, angle, repRule.down_threshold)
            : 'neutral';

        pendingLiveRef.current = {
          angle,
          phase: s.phase,
          holdProgress: s.holdProgress,
          holdElapsedMs: s.holdElapsedMs,
          velocity,
          direction,
        };

        // Flush when the throttle window has elapsed, or immediately on a rep
        // boundary so the UI never lags behind a completed rep.
        if (repCompleted || now - lastLiveFlushRef.current >= LIVE_UI_INTERVAL_MS) {
          const p = pendingLiveRef.current;
          setCurrentAngle(p.angle);
          setRepPhase(p.phase);
          setHoldProgress(p.holdProgress);
          setHoldElapsedMs(p.holdElapsedMs);
          setVelocity(p.velocity);
          setDirection(p.direction);
          lastLiveFlushRef.current = now;
        }
      }
    }

    // Composite rep counting (when exercise has no ROM rep rule)
    const config = trackingConfigRef.current;
    if (!repRule && config?.mode === 'composite' && correctAnglesRef.current?.length) {
      const firstRule = correctAnglesRef.current[0];
      const triplet: [number, number, number] = Array.isArray(firstRule.landmarks)
        ? firstRule.landmarks as [number, number, number]
        : [firstRule.landmarks[0], firstRule.landmarks[1], firstRule.landmarks[2]];
      const use3D_c = !!(firstRule.movement && ROM_STANDARDS[firstRule.movement]?.use_3d);
      const rawA = computeAngleForRule(lm, triplet, firstRule.side ?? 'bilateral', wlm, use3D_c);
      if (rawA !== null) {
        countCompositeRep(smoothAngle(rawA));
      }
    }

    // ── 2. Rolling joint-group angle history (every frame) ───────────────
    // Track all major joints regardless of the exercise rules — used for
    // wrong-exercise detection and the real-time overlay for all groups.
    const history = angleHistoryRef.current;
    for (const [group, { triplets }] of Object.entries(JOINT_GROUPS)) {
      let groupAngle: number | null = null;
      for (const t of triplets) {
        const a = lm[t[0]], b = lm[t[1]], c = lm[t[2]];
        if (
          a && b && c &&
          (a.visibility ?? 0) >= VISIBILITY_THRESHOLD &&
          (b.visibility ?? 0) >= VISIBILITY_THRESHOLD &&
          (c.visibility ?? 0) >= VISIBILITY_THRESHOLD
        ) {
          const ang = computeAngleForRule(lm, t as [number, number, number], 'bilateral');
          if (ang !== null) { groupAngle = ang; break; }
        }
      }
      if (groupAngle !== null) {
        history[group].push(groupAngle);
        if (history[group].length > DETECTION_WINDOW) {
          history[group].shift();
        }
      }
    }

    // ── 3. Every 30th frame: form scoring + snapshot + current angles ────
    if (frameCount.current % 30 !== 0) return;

    // Cap snapshots at 120 (~2 min of data at 1 per second)
    const snapshotInterval = snapshots.current.length >= 120 ? 60 : 30;
    if (frameCount.current % snapshotInterval === 0) {
      snapshots.current.push({
        timestamp: Date.now(),
        landmarks: lm.map((l) => ({
          x:          parseFloat(l.x.toFixed(4)),
          y:          parseFloat(l.y.toFixed(4)),
          z:          parseFloat(l.z.toFixed(4)),
          visibility: parseFloat((l.visibility ?? 0).toFixed(4)),
        })),
      });
    }

    // Current angle snapshot for each rule (for the ROM overlay panel)
    const rules = correctAnglesRef.current;
    if (rules && rules.length > 0) {
      const angles: Record<string, number> = {};
      for (const rule of rules) {
        const triplet: [number, number, number] = Array.isArray(rule.landmarks)
          ? rule.landmarks as [number, number, number]
          : [rule.landmarks[0], rule.landmarks[1], rule.landmarks[2]];
        const use3D_r = !!(rule.movement && ROM_STANDARDS[rule.movement]?.use_3d);
        const rawAngle = computeAngleForRule(lm, triplet, rule.side ?? 'bilateral', wlm, use3D_r);
        const angle = rawAngle !== null ? clampToPhysiological(rawAngle, rule.movement) : null;
        if (angle !== null) angles[rule.joint] = Math.round(angle);
      }
      setCurrentAngles(angles);

      const { score, feedback: fb } = analyzeForm(lm, rules, wlm);
      setFormScore(score);
      setFeedback(fb);
    } else {
      const visibleCount = lm.filter((l) => (l.visibility ?? 0) > LANDMARK_CLEAR_THRESHOLD).length;
      const score        = Math.round((visibleCount / 33) * 100);
      setFormScore(score);
      setFeedback(
        score >= 80 ? 'Great form! Keep it up 💪'
        : score >= 50 ? 'Good — try to face the camera more'
        : 'Move closer to the camera',
      );
    }

    // ── 4. Every 90th frame: wrong-exercise detection (~3 s) ─────────────
    if (frameCount.current % DETECTION_WINDOW === 0) {
      const targetGroup = targetGroupRef.current;
      if (targetGroup) {
        const warning = detectWrongExercise(angleHistoryRef.current, targetGroup);
        setWrongExerciseWarning(warning);
      }
    }
  }, [smoothAngle, countCompositeRep, clampToPhysiological]); // reads correctAngles/trackingConfig via ref on every call

  const getMotionData = useCallback(() => {
    const sm = smRef.current;
    const s  = sm?.stats;

    // Per-joint angle stats from the rolling history (min / max / mean over the session)
    const joint_breakdown: Record<string, { min: number; max: number; mean: number }> = {};
    for (const [group, angles] of Object.entries(angleHistoryRef.current)) {
      if (angles.length === 0) continue;
      const min  = Math.round(Math.min(...angles));
      const max  = Math.round(Math.max(...angles));
      const mean = Math.round(angles.reduce((a, b) => a + b, 0) / angles.length);
      joint_breakdown[group] = { min, max, mean };
    }

    return {
      snapshots:        snapshots.current,
      total_frames:     frameCount.current,
      duration_seconds: Math.round(frameCount.current / 30),
      side:             activeSideRef.current ?? null,
      rep_count:        s?.repCount ?? 0,
      peak_rom:         s?.peakROM  ?? null,
      avg_rom:          s?.averageROM != null ? Math.round(s.averageROM) : null,
      holds_met:        s?.holdsMet ?? 0,
      rep_history:      sm?.allReps.map(r => ({
        rep:             r.repNumber,
        peak_angle:      Math.round(r.peakAngle),
        hold_duration_ms: r.holdDurationMs,
        hold_met:        r.holdMet,
      })) ?? [],
      joint_breakdown,
    };
  }, []);

  const reset = useCallback(() => {
    snapshots.current      = [];
    frameCount.current     = 0;
    smRef.current?.reset();
    repPhaseRef.current    = 'ready';
    angleHistoryRef.current = Object.fromEntries(
      Object.keys(JOINT_GROUPS).map((g) => [g, []]),
    );
    angleBufferRef.current = [];
    prevAngleRef.current   = null;
    pendingLiveRef.current = null;
    lastLiveFlushRef.current = 0;
    setFormScore(0);
    setFeedback('');
    setRepCount(0);
    setLastROM(null);
    setCurrentAngle(null);
    setCurrentAngles({});
    setWrongExerciseWarning(null);
    setVelocity(0);
    setDirection('neutral');
    setRepPhase('IDLE');
    setHoldProgress(0);
    setHoldElapsedMs(0);
  }, []);

  return {
    processResults,
    formScore,
    feedback,
    repCount,
    lastROM,
    currentAngle,
    currentAngles,
    wrongExerciseWarning,
    velocity,
    direction,
    repPhase,
    holdProgress,
    holdElapsedMs,
    holdRequiredMs,
    getMotionData,
    reset,
  };
}
