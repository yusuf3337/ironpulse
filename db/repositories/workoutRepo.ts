import { type SQLiteDatabase } from "expo-sqlite";
import { WorkoutSession, WorkoutSet } from "../schema";

export class WorkoutRepository {
  constructor(private db: SQLiteDatabase) {}

  async getRecentSessions(limit = 20): Promise<WorkoutSession[]> {
    const rows = await this.db.getAllAsync<any>(
      `SELECT * FROM workout_sessions 
       ORDER BY started_at DESC 
       LIMIT ?;`,
      [limit]
    );

    return rows.map((r) => ({
      id: r.id,
      programId: r.program_id,
      programDayId: r.program_day_id,
      sessionName: r.session_name,
      sessionType: r.session_type,
      startedAt: r.started_at,
      completedAt: r.completed_at,
      status: r.status,
      durationSeconds: r.duration_seconds,
      notes: r.notes,
    }));
  }

  async getSetsForSession(sessionId: string): Promise<WorkoutSet[]> {
    const rows = await this.db.getAllAsync<any>(
      `SELECT * FROM workout_sets 
       WHERE session_id = ? 
       ORDER BY set_number ASC;`,
      [sessionId]
    );

    return rows.map((r) => ({
      id: r.id,
      sessionId: r.session_id,
      exerciseId: r.exercise_id,
      exerciseName: r.exercise_name,
      setNumber: r.set_number,
      weight: r.weight,
      reps: r.reps,
      completed: Boolean(r.completed),
      createdAt: r.created_at,
    }));
  }

  async saveCompletedSession(
    session: Omit<WorkoutSession, "id">,
    sets: Array<Omit<WorkoutSet, "id" | "sessionId">>
  ): Promise<string> {
    const sessionId = `ws-${Date.now()}`;

    await this.db.withTransactionAsync(async () => {
      await this.db.runAsync(
        `INSERT INTO workout_sessions 
          (id, program_id, program_day_id, session_name, session_type, started_at, completed_at, status, duration_seconds, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          sessionId,
          session.programId,
          session.programDayId,
          session.sessionName,
          session.sessionType,
          session.startedAt,
          session.completedAt,
          session.status,
          session.durationSeconds,
          session.notes,
        ]
      );

      for (let i = 0; i < sets.length; i++) {
        const s = sets[i];
        const setId = `set-${Date.now()}-${i}`;
        await this.db.runAsync(
          `INSERT INTO workout_sets 
            (id, session_id, exercise_id, exercise_name, set_number, weight, reps, completed, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            setId,
            sessionId,
            s.exerciseId,
            s.exerciseName,
            s.setNumber,
            s.weight,
            s.reps,
            s.completed ? 1 : 0,
            s.createdAt,
          ]
        );
      }
    });

    return sessionId;
  }

  async getPreviousBest(exerciseName: string): Promise<{ weight: number; reps: number } | null> {
    const row = await this.db.getFirstAsync<any>(
      `SELECT weight, reps FROM workout_sets 
       WHERE exercise_name = ? AND completed = 1 
       ORDER BY weight DESC, reps DESC 
       LIMIT 1;`,
      [exerciseName]
    );

    if (!row) return null;
    return { weight: row.weight, reps: row.reps };
  }

  async getSessionsCountThisWeek(): Promise<number> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM workout_sessions 
       WHERE started_at >= ? AND status = 'completed';`,
      [oneWeekAgo.toISOString()]
    );

    return result?.count ?? 0;
  }
}
