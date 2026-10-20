import { type SQLiteDatabase } from "expo-sqlite";
import { PersonalRecord } from "../schema";

export class PersonalRecordRepository {
  constructor(private db: SQLiteDatabase) {}

  async getAllPRs(): Promise<PersonalRecord[]> {
    const rows = await this.db.getAllAsync<any>(
      `SELECT * FROM personal_records 
       ORDER BY weight DESC;`
    );

    return rows.map((r) => ({
      id: r.id,
      exerciseId: r.exercise_id,
      exerciseName: r.exercise_name,
      recordType: r.record_type,
      weight: r.weight,
      reps: r.reps,
      unit: r.unit,
      achievedAt: r.achieved_at,
      notes: r.notes,
    }));
  }

  async getPRForExercise(exerciseName: string): Promise<PersonalRecord | null> {
    const row = await this.db.getFirstAsync<any>(
      `SELECT * FROM personal_records 
       WHERE exercise_name = ? 
       ORDER BY weight DESC, reps DESC 
       LIMIT 1;`,
      [exerciseName]
    );

    if (!row) return null;
    return {
      id: row.id,
      exerciseId: row.exercise_id,
      exerciseName: row.exercise_name,
      recordType: row.record_type,
      weight: row.weight,
      reps: row.reps,
      unit: row.unit,
      achievedAt: row.achieved_at,
      notes: row.notes,
    };
  }

  // Brzycki formula for estimated 1RM
  calculateEstimated1RM(weight: number, reps: number): number {
    if (reps <= 1) return weight;
    return Math.round(weight * (36 / (37 - reps)));
  }

  async checkAndSavePR(
    exerciseId: string,
    exerciseName: string,
    weight: number,
    reps: number,
    unit = "kg"
  ): Promise<{ isNewPR: boolean; pr: PersonalRecord | null }> {
    const currentPR = await this.getPRForExercise(exerciseName);

    const isNewPR =
      !currentPR ||
      weight > currentPR.weight ||
      (weight === currentPR.weight && reps > currentPR.reps);

    if (isNewPR) {
      const id = `pr-${Date.now()}`;
      const now = new Date().toISOString();

      await this.db.runAsync(
        `INSERT INTO personal_records 
          (id, exercise_id, exercise_name, record_type, weight, reps, unit, achieved_at, notes)
         VALUES (?, ?, ?, 'heaviest_weight', ?, ?, ?, ?, 'Automatically recorded set PR');`,
        [id, exerciseId, exerciseName, weight, reps, unit, now]
      );

      return {
        isNewPR: true,
        pr: {
          id,
          exerciseId,
          exerciseName,
          recordType: "heaviest_weight",
          weight,
          reps,
          unit,
          achievedAt: now,
          notes: "Automatically recorded set PR",
        },
      };
    }

    return { isNewPR: false, pr: currentPR };
  }

  async getAthleteTierRank(): Promise<{
    rank: string;
    tier: number;
    progressPercent: number;
    description: string;
  }> {
    const prCountRow = await this.db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM personal_records;"
    );
    const prCount = prCountRow?.count ?? 0;

    const sessionCountRow = await this.db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM workout_sessions WHERE status = 'completed';"
    );
    const sessionCount = sessionCountRow?.count ?? 0;

    const score = prCount * 5 + sessionCount * 3;

    if (score < 15) {
      return {
        rank: "BRONZE",
        tier: 1,
        progressPercent: Math.min(100, Math.round((score / 15) * 100)),
        description: "Initial foundational training and introductory lifting.",
      };
    } else if (score < 40) {
      return {
        rank: "SILVER",
        tier: 2,
        progressPercent: Math.min(100, Math.round(((score - 15) / 25) * 100)),
        description: "Establishing regular training frequency and setting base records.",
      };
    } else if (score < 80) {
      return {
        rank: "GOLD",
        tier: 3,
        progressPercent: Math.min(100, Math.round(((score - 40) / 40) * 100)),
        description: "Demonstrated dedication, consistent hypertrophy, and power gains.",
      };
    } else if (score < 140) {
      return {
        rank: "PLATINUM",
        tier: 4,
        progressPercent: Math.min(100, Math.round(((score - 80) / 60) * 100)),
        description: "Heavy compound lifting proficiency across all fundamental splits.",
      };
    } else if (score < 220) {
      return {
        rank: "DIAMOND",
        tier: 5,
        progressPercent: Math.min(100, Math.round(((score - 140) / 80) * 100)),
        description: "Elite level athletic conditioning, high volume, and peak PRs.",
      };
    } else {
      return {
        rank: "CHALLENGER",
        tier: 6,
        progressPercent: 100,
        description: "Pinnacle athletic discipline and relentless personal excellence.",
      };
    }
  }
}
