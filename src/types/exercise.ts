export type ExerciseArea =
  | 'back' | 'chest' | 'elbow_forearm_wrist' | 'general'
  | 'head_neck' | 'lower_limbs' | 'pelvic' | 'upper_limbs';

export type ExerciseCategory =
  | 'strengthening' | 'stretching' | 'rom' | 'functional' | 'endurance'
  | 'lung_expansion' | 'chest_wall_mobilization' | 'airways_clearance'
  | 'chest_abs' | 'cool_down' | 'core_stability' | 'legs' | 'strengthening_arm';

export type AccessTier = 'free' | 'paid';
export type VideoSource = 'upload' | 'youtube' | null;

export interface ExerciseVideo {
  source: VideoSource;
  url: string | null;
  youtube_id: string | null;
}

export interface Exercise {
  id: number;
  title: string;
  area: ExerciseArea;
  area_label: string;
  category: ExerciseCategory;
  category_label: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  access_tier: AccessTier;
  is_locked: boolean;
  video: ExerciseVideo;
  thumbnail_url: string | null;
  default_sets: number;
  default_reps: number;
  default_hold_seconds: number;
  is_personalized: boolean;
  instructions: string | null;
  correct_angles?: unknown[];
}
