import { type SQLiteDatabase } from "expo-sqlite";
import { AthleteProfile, BodyMeasurement } from "../schema";

export class ProfileRepository {
  constructor(private db: SQLiteDatabase) {}

  async getProfile(): Promise<AthleteProfile | null> {
    const row = await this.db.getFirstAsync<any>(
      "SELECT * FROM athlete_profile LIMIT 1;"
    );
    if (!row) return null;
    return {
      id: row.id,
      displayName: row.display_name,
      age: row.age,
      height: row.height,
      currentWeight: row.current_weight,
      preferredWeightUnit: row.preferred_weight_unit,
      preferredDistanceUnit: row.preferred_distance_unit,
      sex: row.sex,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async updateProfile(profile: Partial<AthleteProfile>): Promise<void> {
    const now = new Date().toISOString();
    await this.db.runAsync(
      `UPDATE athlete_profile 
       SET display_name = COALESCE(?, display_name),
           age = COALESCE(?, age),
           height = COALESCE(?, height),
           current_weight = COALESCE(?, current_weight),
           preferred_weight_unit = COALESCE(?, preferred_weight_unit),
           preferred_distance_unit = COALESCE(?, preferred_distance_unit),
           sex = COALESCE(?, sex),
           updated_at = ?
       WHERE id = 'default-athlete';`,
      [
        profile.displayName ?? null,
        profile.age ?? null,
        profile.height ?? null,
        profile.currentWeight ?? null,
        profile.preferredWeightUnit ?? null,
        profile.preferredDistanceUnit ?? null,
        profile.sex ?? null,
        now,
      ]
    );
  }

  async getMeasurements(): Promise<BodyMeasurement[]> {
    const rows = await this.db.getAllAsync<any>(
      "SELECT * FROM body_measurements ORDER BY recorded_at DESC LIMIT 50;"
    );
    return rows.map((r) => ({
      id: r.id,
      measurementType: r.measurement_type,
      value: r.value,
      unit: r.unit,
      recordedAt: r.recorded_at,
      notes: r.notes,
    }));
  }

  async addMeasurement(measurement: Omit<BodyMeasurement, "id">): Promise<void> {
    const id = `meas-${Date.now()}`;
    await this.db.runAsync(
      `INSERT INTO body_measurements (id, measurement_type, value, unit, recorded_at, notes)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        id,
        measurement.measurementType,
        measurement.value,
        measurement.unit,
        measurement.recordedAt,
        measurement.notes,
      ]
    );

    // If it's a weight measurement, update the profile current weight as well
    if (measurement.measurementType === "weight") {
      await this.updateProfile({ currentWeight: measurement.value });
    }
  }
}
