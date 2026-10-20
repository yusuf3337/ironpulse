import { type SQLiteDatabase } from "expo-sqlite";
import { BoxingPreset, BoxingSession, BoxingCombination } from "../schema";

export class BoxingRepository {
  constructor(private db: SQLiteDatabase) {}

  async getPresets(): Promise<BoxingPreset[]> {
    const rows = await this.db.getAllAsync<any>(
      "SELECT * FROM boxing_presets ORDER BY rounds DESC;"
    );

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      rounds: r.rounds,
      workSeconds: r.work_seconds,
      restSeconds: r.rest_seconds,
      prepSeconds: r.prep_seconds,
      soundEnabled: Boolean(r.sound_enabled),
      hapticsEnabled: Boolean(r.haptics_enabled),
    }));
  }

  async savePreset(preset: Omit<BoxingPreset, "id">): Promise<string> {
    const id = `b-pre-${Date.now()}`;
    await this.db.runAsync(
      `INSERT INTO boxing_presets 
        (id, name, rounds, work_seconds, rest_seconds, prep_seconds, sound_enabled, haptics_enabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        preset.name,
        preset.rounds,
        preset.workSeconds,
        preset.restSeconds,
        preset.prepSeconds,
        preset.soundEnabled ? 1 : 0,
        preset.hapticsEnabled ? 1 : 0,
      ]
    );
    return id;
  }

  async saveSession(session: Omit<BoxingSession, "id">): Promise<string> {
    const id = `box-sess-${Date.now()}`;
    await this.db.runAsync(
      `INSERT INTO boxing_sessions 
        (id, preset_name, completed_rounds, total_rounds, work_seconds, rest_seconds, started_at, completed_at, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        session.presetName,
        session.completedRounds,
        session.totalRounds,
        session.workSeconds,
        session.restSeconds,
        session.startedAt,
        session.completedAt,
        session.notes,
      ]
    );
    return id;
  }

  async getRoundsCompletedThisWeek(): Promise<number> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await this.db.getFirstAsync<{ total_rounds: number }>(
      `SELECT SUM(completed_rounds) as total_rounds FROM boxing_sessions 
       WHERE started_at >= ?;`,
      [oneWeekAgo.toISOString()]
    );

    return result?.total_rounds ?? 0;
  }

  async getCombinations(): Promise<BoxingCombination[]> {
    const rows = await this.db.getAllAsync<any>(
      "SELECT * FROM boxing_combinations ORDER BY is_custom ASC, id ASC;"
    );

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      stepsJson: r.steps_json,
      isCustom: Boolean(r.is_custom),
    }));
  }

  async addCombination(name: string, description: string, steps: string[]): Promise<string> {
    const id = `combo-${Date.now()}`;
    await this.db.runAsync(
      `INSERT INTO boxing_combinations (id, name, description, steps_json, is_custom)
       VALUES (?, ?, ?, ?, 1);`,
      [id, name, description, JSON.stringify(steps)]
    );
    return id;
  }
}
