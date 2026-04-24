// MediaPipe Pose — 33 landmark indices + movement-to-triplet map
// All triplets are stored as LEFT-side indices. Call mirrorTriplet() for the right side.

export const LM = {
  NOSE: 0,
  LEFT_EAR: 7,  RIGHT_EAR: 8,
  LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,    RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,    RIGHT_WRIST: 16,
  LEFT_PINKY: 17,    RIGHT_PINKY: 18,
  LEFT_INDEX: 19,    RIGHT_INDEX: 20,
  LEFT_THUMB: 21,    RIGHT_THUMB: 22,
  LEFT_HIP: 23,      RIGHT_HIP: 24,
  LEFT_KNEE: 25,     RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,    RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,     RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31, RIGHT_FOOT_INDEX: 32,
} as const;

// Joints that exist on both sides of the body
export const BILATERAL_JOINTS = ['shoulder', 'elbow', 'wrist', 'hip', 'knee', 'ankle'] as const;
export type BilateralJointName = typeof BILATERAL_JOINTS[number];

// [proximal, vertex, distal] — LEFT side indices only
export const LANDMARK_MAP: Record<string, [number, number, number]> = {
  shoulder_flexion:     [LM.LEFT_HIP,      LM.LEFT_SHOULDER, LM.LEFT_ELBOW],
  shoulder_extension:   [LM.LEFT_HIP,      LM.LEFT_SHOULDER, LM.LEFT_ELBOW],
  shoulder_abduction:   [LM.LEFT_HIP,      LM.LEFT_SHOULDER, LM.LEFT_ELBOW],
  shoulder_adduction:   [LM.LEFT_HIP,      LM.LEFT_SHOULDER, LM.LEFT_ELBOW],
  shoulder_ir:          [LM.LEFT_HIP,      LM.LEFT_SHOULDER, LM.LEFT_ELBOW],
  shoulder_er:          [LM.LEFT_HIP,      LM.LEFT_SHOULDER, LM.LEFT_ELBOW],

  elbow_flexion:        [LM.LEFT_SHOULDER, LM.LEFT_ELBOW,    LM.LEFT_WRIST],
  elbow_extension:      [LM.LEFT_SHOULDER, LM.LEFT_ELBOW,    LM.LEFT_WRIST],

  wrist_flexion:        [LM.LEFT_ELBOW,    LM.LEFT_WRIST,    LM.LEFT_INDEX],
  wrist_extension:      [LM.LEFT_ELBOW,    LM.LEFT_WRIST,    LM.LEFT_INDEX],
  wrist_radial:         [LM.LEFT_ELBOW,    LM.LEFT_WRIST,    LM.LEFT_THUMB],
  wrist_ulnar:          [LM.LEFT_ELBOW,    LM.LEFT_WRIST,    LM.LEFT_PINKY],

  hip_flexion:          [LM.LEFT_SHOULDER, LM.LEFT_HIP,      LM.LEFT_KNEE],
  hip_extension:        [LM.LEFT_SHOULDER, LM.LEFT_HIP,      LM.LEFT_KNEE],
  hip_abduction:        [LM.LEFT_SHOULDER, LM.LEFT_HIP,      LM.LEFT_KNEE],
  hip_adduction:        [LM.LEFT_SHOULDER, LM.LEFT_HIP,      LM.LEFT_KNEE],
  hip_ir:               [LM.LEFT_SHOULDER, LM.LEFT_HIP,      LM.LEFT_KNEE],
  hip_er:               [LM.LEFT_SHOULDER, LM.LEFT_HIP,      LM.LEFT_KNEE],

  knee_flexion:         [LM.LEFT_HIP,      LM.LEFT_KNEE,     LM.LEFT_ANKLE],
  knee_extension:       [LM.LEFT_HIP,      LM.LEFT_KNEE,     LM.LEFT_ANKLE],

  ankle_dorsiflexion:   [LM.LEFT_KNEE,     LM.LEFT_ANKLE,    LM.LEFT_FOOT_INDEX],
  ankle_plantarflexion: [LM.LEFT_KNEE,     LM.LEFT_ANKLE,    LM.LEFT_FOOT_INDEX],

  // Midline — use left-side triplet always (no mirroring)
  neck_flexion:         [LM.LEFT_EAR,      LM.LEFT_SHOULDER, LM.LEFT_HIP],
  neck_extension:       [LM.LEFT_EAR,      LM.LEFT_SHOULDER, LM.LEFT_HIP],
  neck_rotation:        [LM.LEFT_EAR,      LM.RIGHT_EAR,     LM.RIGHT_SHOULDER],
  neck_lateral:         [LM.LEFT_EAR,      LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER],

  spine_flexion:        [LM.LEFT_SHOULDER, LM.LEFT_HIP,      LM.LEFT_KNEE],
  spine_extension:      [LM.LEFT_SHOULDER, LM.LEFT_HIP,      LM.LEFT_KNEE],
  spine_rotation:       [LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER, LM.RIGHT_HIP],
  spine_lateral:        [LM.LEFT_SHOULDER, LM.LEFT_HIP,      LM.RIGHT_HIP],
};

// Which direction = the PRIMARY (therapeutic) movement.
// 'down' = angle DECREASES during primary movement.
// 'up'   = angle INCREASES during primary movement.
//
// Note on shoulder triplets: [hip, shoulder, elbow] has rest angle ~0° (arm at
// side — both shoulder→hip and shoulder→elbow vectors point down, so they're
// near-parallel). Abduction/flexion INCREASE the angle toward 180° overhead,
// so shoulder flexion/abduction are 'up', not 'down'. Getting this wrong
// inverts the primary/opposite label (e.g. a lateral raise shows "Adduction"
// on the lift and "Abduction" on the return).
export const MOVEMENT_PRIMARY_DIR: Record<string, 'up' | 'down'> = {
  shoulder_flexion: 'up', shoulder_extension: 'up',
  shoulder_abduction: 'up', shoulder_adduction: 'down',
  shoulder_ir: 'down', shoulder_er: 'up',
  elbow_flexion: 'down', elbow_extension: 'up',
  wrist_flexion: 'down', wrist_extension: 'up',
  wrist_radial: 'down', wrist_ulnar: 'up',
  hip_flexion: 'down', hip_extension: 'up',
  hip_abduction: 'down', hip_adduction: 'up',
  hip_ir: 'down', hip_er: 'up',
  knee_flexion: 'down', knee_extension: 'up',
  ankle_dorsiflexion: 'down', ankle_plantarflexion: 'up',
  neck_flexion: 'down', neck_extension: 'up',
  neck_rotation: 'down', neck_lateral: 'down',
  spine_flexion: 'down', spine_extension: 'up',
  spine_rotation: 'down', spine_lateral: 'down',
};

// Left ↔ Right landmark mirror
export const MIRROR: Record<number, number> = {
  7:8,   8:7,
  11:12, 12:11,
  13:14, 14:13,
  15:16, 16:15,
  17:18, 18:17,
  19:20, 20:19,
  21:22, 22:21,
  23:24, 24:23,
  25:26, 26:25,
  27:28, 28:27,
  29:30, 30:29,
  31:32, 32:31,
};

export function mirrorTriplet(t: [number, number, number]): [number, number, number] {
  return [MIRROR[t[0]] ?? t[0], MIRROR[t[1]] ?? t[1], MIRROR[t[2]] ?? t[2]];
}

export function isBilateralJoint(jointName: string): boolean {
  const lower = jointName.toLowerCase();
  return BILATERAL_JOINTS.some(j => lower.includes(j));
}

// Bone segments to highlight for each joint (LEFT side; mirror for right)
export const JOINT_BONE_SEGMENTS: Record<string, [number, number][]> = {
  shoulder: [[LM.LEFT_HIP, LM.LEFT_SHOULDER], [LM.LEFT_SHOULDER, LM.LEFT_ELBOW]],
  elbow:    [[LM.LEFT_SHOULDER, LM.LEFT_ELBOW], [LM.LEFT_ELBOW, LM.LEFT_WRIST]],
  wrist:    [[LM.LEFT_ELBOW, LM.LEFT_WRIST], [LM.LEFT_WRIST, LM.LEFT_INDEX]],
  hip:      [[LM.LEFT_SHOULDER, LM.LEFT_HIP], [LM.LEFT_HIP, LM.LEFT_KNEE]],
  knee:     [[LM.LEFT_HIP, LM.LEFT_KNEE], [LM.LEFT_KNEE, LM.LEFT_ANKLE]],
  ankle:    [[LM.LEFT_KNEE, LM.LEFT_ANKLE], [LM.LEFT_ANKLE, LM.LEFT_FOOT_INDEX]],
};

// When the angle is in the OPPOSITE direction, show this short label instead of the full movement name
export const OPPOSITE_LABEL: Record<string, string> = {
  shoulder_flexion: 'Extension',    shoulder_extension: 'Flexion',
  shoulder_abduction: 'Adduction',  shoulder_adduction: 'Abduction',
  shoulder_ir: 'Ext. Rotation',     shoulder_er: 'Int. Rotation',
  elbow_flexion: 'Extension',       elbow_extension: 'Flexion',
  wrist_flexion: 'Extension',       wrist_extension: 'Flexion',
  wrist_radial: 'Ulnar Dev.',       wrist_ulnar: 'Radial Dev.',
  hip_flexion: 'Extension',         hip_extension: 'Flexion',
  hip_abduction: 'Adduction',       hip_adduction: 'Abduction',
  hip_ir: 'Ext. Rotation',          hip_er: 'Int. Rotation',
  knee_flexion: 'Extension',        knee_extension: 'Flexion',
  ankle_dorsiflexion: 'Plantarflex.',ankle_plantarflexion: 'Dorsiflexion',
  neck_flexion: 'Extension',        neck_extension: 'Flexion',
  neck_rotation: 'Rotation',        neck_lateral: 'Lateral Flexion',
  spine_flexion: 'Extension',       spine_extension: 'Flexion',
  spine_rotation: 'Rotation',       spine_lateral: 'Lateral Flexion',
};

// All MediaPipe Pose skeleton connections for the ghost body layer
export const ALL_CONNECTIONS: [number, number][] = [
  [LM.LEFT_SHOULDER,  LM.RIGHT_SHOULDER],
  [LM.LEFT_SHOULDER,  LM.LEFT_ELBOW],
  [LM.LEFT_ELBOW,     LM.LEFT_WRIST],
  [LM.RIGHT_SHOULDER, LM.RIGHT_ELBOW],
  [LM.RIGHT_ELBOW,    LM.RIGHT_WRIST],
  [LM.LEFT_SHOULDER,  LM.LEFT_HIP],
  [LM.RIGHT_SHOULDER, LM.RIGHT_HIP],
  [LM.LEFT_HIP,       LM.RIGHT_HIP],
  [LM.LEFT_HIP,       LM.LEFT_KNEE],
  [LM.LEFT_KNEE,      LM.LEFT_ANKLE],
  [LM.RIGHT_HIP,      LM.RIGHT_KNEE],
  [LM.RIGHT_KNEE,     LM.RIGHT_ANKLE],
  [LM.LEFT_WRIST,     LM.LEFT_INDEX],
  [LM.RIGHT_WRIST,    LM.RIGHT_INDEX],
  [LM.LEFT_ANKLE,     LM.LEFT_HEEL],
  [LM.RIGHT_ANKLE,    LM.RIGHT_HEEL],
  [LM.LEFT_HEEL,      LM.LEFT_FOOT_INDEX],
  [LM.RIGHT_HEEL,     LM.RIGHT_FOOT_INDEX],
  [LM.LEFT_EAR,       LM.LEFT_SHOULDER],
  [LM.RIGHT_EAR,      LM.RIGHT_SHOULDER],
];
