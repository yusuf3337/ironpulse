export interface AthleteProfile {
  id: string;
  displayName: string;
  age: number | null;
  height: number | null;
  currentWeight: number | null;
  preferredWeightUnit: "kg" | "lb";
  preferredDistanceUnit: "cm" | "in";
  sex: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramDay {
  id: string;
  programId: string;
  weekday: string; // mon, tue, wed, thu, fri, sat, sun
  title: string;
  sessionType: string;
  isRest: boolean;
  sortOrder: number;
}

export interface ProgramExercise {
  id: string;
  programDayId: string;
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: string;
  targetRestSeconds: number;
  sortOrder: number;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: string;
  equipment: string;
  isCustom: boolean;
}

export interface WorkoutSession {
  id: string;
  programId: string | null;
  programDayId: string | null;
  sessionName: string;
  sessionType: string;
  startedAt: string;
  completedAt: string | null;
  status: "in_progress" | "completed" | "cancelled";
  durationSeconds: number;
  notes: string;
}

export interface WorkoutSet {
  id: string;
  sessionId: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
  createdAt: string;
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  recordType: "heaviest_weight" | "estimated_1rm" | "max_reps";
  weight: number;
  reps: number;
  unit: string;
  achievedAt: string;
  notes: string;
}

export interface BodyMeasurement {
  id: string;
  measurementType: "weight" | "waist" | "chest" | "arms" | "thighs";
  value: number;
  unit: string;
  recordedAt: string;
  notes: string;
}

export interface BoxingPreset {
  id: string;
  name: string;
  rounds: number;
  workSeconds: number;
  restSeconds: number;
  prepSeconds: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export interface BoxingSession {
  id: string;
  presetName: string;
  completedRounds: number;
  totalRounds: number;
  workSeconds: number;
  restSeconds: number;
  startedAt: string;
  completedAt: string;
  notes: string;
}

export interface BoxingCombination {
  id: string;
  name: string;
  description: string;
  stepsJson: string; // JSON array of strikes/defense
  isCustom: boolean;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  targetValue: number;
  currentValue: number;
  unlockedAt: string | null;
}
