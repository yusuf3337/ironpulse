import { type SQLiteDatabase } from "expo-sqlite";

export interface IronPulseBackupArchive {
  version: number;
  appName: "IRONPULSE";
  exportedAt: string;
  data: {
    athleteProfile: any[];
    exercises: any[];
    programs: any[];
    programDays: any[];
    programExercises: any[];
    workoutSessions: any[];
    workoutSets: any[];
    personalRecords: any[];
    bodyMeasurements: any[];
    boxingPresets: any[];
    boxingSessions: any[];
    boxingCombinations: any[];
    achievements: any[];
  };
}

export class BackupRepository {
  constructor(private db: SQLiteDatabase) {}

  async exportDatabase(): Promise<IronPulseBackupArchive> {
    const athleteProfile = await this.db.getAllAsync("SELECT * FROM athlete_profile;");
    const exercises = await this.db.getAllAsync("SELECT * FROM exercises;");
    const programs = await this.db.getAllAsync("SELECT * FROM programs;");
    const programDays = await this.db.getAllAsync("SELECT * FROM program_days;");
    const programExercises = await this.db.getAllAsync("SELECT * FROM program_exercises;");
    const workoutSessions = await this.db.getAllAsync("SELECT * FROM workout_sessions;");
    const workoutSets = await this.db.getAllAsync("SELECT * FROM workout_sets;");
    const personalRecords = await this.db.getAllAsync("SELECT * FROM personal_records;");
    const bodyMeasurements = await this.db.getAllAsync("SELECT * FROM body_measurements;");
    const boxingPresets = await this.db.getAllAsync("SELECT * FROM boxing_presets;");
    const boxingSessions = await this.db.getAllAsync("SELECT * FROM boxing_sessions;");
    const boxingCombinations = await this.db.getAllAsync("SELECT * FROM boxing_combinations;");
    const achievements = await this.db.getAllAsync("SELECT * FROM achievements;");

    return {
      version: 1,
      appName: "IRONPULSE",
      exportedAt: new Date().toISOString(),
      data: {
        athleteProfile,
        exercises,
        programs,
        programDays,
        programExercises,
        workoutSessions,
        workoutSets,
        personalRecords,
        bodyMeasurements,
        boxingPresets,
        boxingSessions,
        boxingCombinations,
        achievements,
      },
    };
  }

  async validateAndImportDatabase(archive: any): Promise<{ success: boolean; message: string }> {
    if (!archive || typeof archive !== "object") {
      return { success: false, message: "Invalid backup format: root must be an object." };
    }

    if (archive.appName !== "IRONPULSE" || archive.version !== 1) {
      return {
        success: false,
        message: `Incompatible backup file. Expected IRONPULSE v1, found ${archive.appName} v${archive.version}`,
      };
    }

    const { data } = archive;
    if (!data || typeof data !== "object") {
      return { success: false, message: "Missing data payload in backup." };
    }

    await this.db.withTransactionAsync(async () => {
      // Safe insertion using INSERT OR REPLACE
      if (Array.isArray(data.athleteProfile)) {
        for (const p of data.athleteProfile) {
          await this.db.runAsync(
            `INSERT OR REPLACE INTO athlete_profile 
              (id, display_name, age, height, current_weight, preferred_weight_unit, preferred_distance_unit, sex, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              p.id,
              p.display_name,
              p.age,
              p.height,
              p.current_weight,
              p.preferred_weight_unit,
              p.preferred_distance_unit,
              p.sex,
              p.created_at,
              p.updated_at,
            ]
          );
        }
      }

      if (Array.isArray(data.personalRecords)) {
        for (const pr of data.personalRecords) {
          await this.db.runAsync(
            `INSERT OR REPLACE INTO personal_records 
              (id, exercise_id, exercise_name, record_type, weight, reps, unit, achieved_at, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              pr.id,
              pr.exercise_id,
              pr.exercise_name,
              pr.record_type,
              pr.weight,
              pr.reps,
              pr.unit,
              pr.achieved_at,
              pr.notes,
            ]
          );
        }
      }

      if (Array.isArray(data.workoutSessions)) {
        for (const ws of data.workoutSessions) {
          await this.db.runAsync(
            `INSERT OR REPLACE INTO workout_sessions 
              (id, program_id, program_day_id, session_name, session_type, started_at, completed_at, status, duration_seconds, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              ws.id,
              ws.program_id,
              ws.program_day_id,
              ws.session_name,
              ws.session_type,
              ws.started_at,
              ws.completed_at,
              ws.status,
              ws.duration_seconds,
              ws.notes,
            ]
          );
        }
      }

      if (Array.isArray(data.workoutSets)) {
        for (const s of data.workoutSets) {
          await this.db.runAsync(
            `INSERT OR REPLACE INTO workout_sets 
              (id, session_id, exercise_id, exercise_name, set_number, weight, reps, completed, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              s.id,
              s.session_id,
              s.exercise_id,
              s.exercise_name,
              s.set_number,
              s.weight,
              s.reps,
              s.completed,
              s.created_at,
            ]
          );
        }
      }

      if (Array.isArray(data.bodyMeasurements)) {
        for (const m of data.bodyMeasurements) {
          await this.db.runAsync(
            `INSERT OR REPLACE INTO body_measurements 
              (id, measurement_type, value, unit, recorded_at, notes)
             VALUES (?, ?, ?, ?, ?, ?);`,
            [m.id, m.measurement_type, m.value, m.unit, m.recorded_at, m.notes]
          );
        }
      }

      if (Array.isArray(data.boxingSessions)) {
        for (const bs of data.boxingSessions) {
          await this.db.runAsync(
            `INSERT OR REPLACE INTO boxing_sessions 
              (id, preset_name, completed_rounds, total_rounds, work_seconds, rest_seconds, started_at, completed_at, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              bs.id,
              bs.preset_name,
              bs.completed_rounds,
              bs.total_rounds,
              bs.work_seconds,
              bs.rest_seconds,
              bs.started_at,
              bs.completed_at,
              bs.notes,
            ]
          );
        }
      }
    });

    return { success: true, message: "Backup successfully restored!" };
  }
}
