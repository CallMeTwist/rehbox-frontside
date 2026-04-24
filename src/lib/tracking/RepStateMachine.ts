// Rep counting state machine with hold-time enforcement.
// States: IDLE → MOVING → PEAK → RETURNING → BOTTOM → rep counted

export type RepPhase = 'IDLE' | 'MOVING' | 'PEAK' | 'RETURNING' | 'BOTTOM';

export interface RepRecord {
  repNumber: number;
  peakAngle: number;
  holdDurationMs: number;
  holdMet: boolean;
}

export interface RepStats {
  repCount: number;
  phase: RepPhase;
  /** ms spent at PEAK so far (live, updates every frame while at peak) */
  holdElapsedMs: number;
  /** ms required to count the hold */
  holdRequiredMs: number;
  /** 0–1 fraction of hold completed */
  holdProgress: number;
  lastRep: RepRecord | null;
  peakROM: number;
  averageROM: number;
  holdsMet: number;
}

export class RepStateMachine {
  private phase: RepPhase = 'IDLE';
  private reps: RepRecord[] = [];
  private peakAngleThisRep = 0;
  private peakEnteredAt: number | null = null;
  private movingAngles: number[] = [];

  constructor(
    /** Angle that triggers PEAK state (top of movement) */
    private readonly peakThreshold: number,
    /** Angle that triggers BOTTOM on return (rest position) */
    private readonly restThreshold: number,
    /** Required hold seconds at peak (0 = no hold required) */
    private readonly holdSeconds: number = 0,
    /** 'down' = angle DECREASES toward peak (most flexion/abduction) */
    private readonly primaryDir: 'up' | 'down' = 'down',
  ) {}

  private atPeak(angle: number): boolean {
    return this.primaryDir === 'down'
      ? angle <= this.peakThreshold
      : angle >= this.peakThreshold;
  }

  private atRest(angle: number): boolean {
    return this.primaryDir === 'down'
      ? angle >= this.restThreshold
      : angle <= this.restThreshold;
  }

  /** Feed one angle sample. Returns true if a rep was just completed. */
  update(angle: number, now = Date.now()): boolean {
    this.movingAngles.push(angle);
    let repCompleted = false;

    switch (this.phase) {
      case 'IDLE':
        if (!this.atRest(angle)) this.phase = 'MOVING';
        break;

      case 'MOVING':
        if (this.atPeak(angle)) {
          this.phase = 'PEAK';
          this.peakEnteredAt = now;
          this.peakAngleThisRep = angle;
        }
        break;

      case 'PEAK':
        // Track extremity
        if (this.primaryDir === 'down') {
          this.peakAngleThisRep = Math.min(this.peakAngleThisRep, angle);
        } else {
          this.peakAngleThisRep = Math.max(this.peakAngleThisRep, angle);
        }
        // Transition to returning when angle moves back past threshold
        if (!this.atPeak(angle)) this.phase = 'RETURNING';
        break;

      case 'RETURNING':
        if (this.atRest(angle)) {
          const holdMs = this.peakEnteredAt ? now - this.peakEnteredAt : 0;
          const holdMet = holdMs >= this.holdSeconds * 1000;
          this.reps.push({
            repNumber: this.reps.length + 1,
            peakAngle: this.peakAngleThisRep,
            holdDurationMs: holdMs,
            holdMet,
          });
          this.movingAngles = [];
          this.peakEnteredAt = null;
          this.phase = 'BOTTOM';
          repCompleted = true;
        }
        break;

      case 'BOTTOM':
        if (!this.atRest(angle)) this.phase = 'MOVING';
        break;
    }

    return repCompleted;
  }

  get stats(): RepStats {
    const holdElapsedMs = this.phase === 'PEAK' && this.peakEnteredAt
      ? Date.now() - this.peakEnteredAt
      : 0;
    const holdRequiredMs = this.holdSeconds * 1000;
    const roms = this.reps.map(r => Math.abs(r.peakAngle));

    return {
      repCount: this.reps.length,
      phase: this.phase,
      holdElapsedMs,
      holdRequiredMs,
      holdProgress: holdRequiredMs > 0 ? Math.min(1, holdElapsedMs / holdRequiredMs) : 0,
      lastRep: this.reps.at(-1) ?? null,
      peakROM: roms.length ? Math.max(...roms) : 0,
      averageROM: roms.length ? roms.reduce((a, b) => a + b, 0) / roms.length : 0,
      holdsMet: this.reps.filter(r => r.holdMet).length,
    };
  }

  get allReps(): RepRecord[] { return [...this.reps]; }

  reset(): void {
    this.phase = 'IDLE';
    this.reps = [];
    this.peakAngleThisRep = 0;
    this.peakEnteredAt = null;
    this.movingAngles = [];
  }
}
