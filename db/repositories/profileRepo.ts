import { type SQLiteDatabase } from "expo-sqlite";
import { AthleteProfile, BodyMeasurement } from "../schema";

export interface BMICalculation {
  bmi: number;
  category: string;
  categoryKey: "underweight" | "normal" | "overweight" | "obese";
  healthyWeightRange: { min: number; max: number };
}

export class ProfileRepository {
  constructor(private db: SQLiteDatabase) {}

  async getProfile(): Promise<AthleteProfile | null> {
    const row = await this.db.getFirstAsync<any>(
      "SELECT * FROM athlete_profile WHERE id = 'default-athlete' LIMIT 1;"
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

  async isProfileConfigured(): Promise<boolean> {
    const profile = await this.getProfile();
    return Boolean(
      profile &&
      profile.height &&
      profile.height > 0 &&
      profile.currentWeight &&
      profile.currentWeight > 0
    );
  }

  async saveProfile(profile: {
    displayName: string;
    age: number;
    height: number;
    currentWeight: number;
    sex: string;
    preferredWeightUnit?: "kg" | "lb";
    preferredDistanceUnit?: "cm" | "in";
  }): Promise<void> {
    const now = new Date().toISOString();
    await this.db.runAsync(
      `INSERT OR REPLACE INTO athlete_profile 
        (id, display_name, age, height, current_weight, preferred_weight_unit, preferred_distance_unit, sex, created_at, updated_at)
       VALUES ('default-athlete', ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        profile.displayName,
        profile.age,
        profile.height,
        profile.currentWeight,
        profile.preferredWeightUnit ?? "kg",
        profile.preferredDistanceUnit ?? "cm",
        profile.sex,
        now,
        now,
      ]
    );

    // Also record initial weight in body_measurements
    if (profile.currentWeight > 0) {
      await this.addMeasurement({
        measurementType: "weight",
        value: profile.currentWeight,
        unit: profile.preferredWeightUnit ?? "kg",
        recordedAt: now,
        notes: "Profil başlangıç kilosu",
      });
    }
  }

  calculateBMI(weightKg: number, heightCm: number): BMICalculation {
    if (!weightKg || !heightCm || heightCm <= 0) {
      return {
        bmi: 0,
        category: "Bilinmiyor",
        categoryKey: "normal",
        healthyWeightRange: { min: 0, max: 0 },
      };
    }

    const heightM = heightCm / 100;
    const rawBmi = weightKg / (heightM * heightM);
    const bmi = Math.round(rawBmi * 10) / 10;

    let category = "Normal";
    let categoryKey: "underweight" | "normal" | "overweight" | "obese" = "normal";

    if (bmi < 18.5) {
      category = "Zayıf / Düşük Kilo";
      categoryKey = "underweight";
    } else if (bmi <= 24.9) {
      category = "Normal / İdeal";
      categoryKey = "normal";
    } else if (bmi <= 29.9) {
      category = "Fazla Kilolu";
      categoryKey = "overweight";
    } else {
      category = "Obezite / Yüksek";
      categoryKey = "obese";
    }

    const minHealthy = Math.round(18.5 * (heightM * heightM) * 10) / 10;
    const maxHealthy = Math.round(24.9 * (heightM * heightM) * 10) / 10;

    return {
      bmi,
      category,
      categoryKey,
      healthyWeightRange: { min: minHealthy, max: maxHealthy },
    };
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

    if (measurement.measurementType === "weight") {
      const now = new Date().toISOString();
      await this.db.runAsync(
        `UPDATE athlete_profile 
         SET current_weight = ?, updated_at = ? 
         WHERE id = 'default-athlete';`,
        [measurement.value, now]
      );
    }
  }
}
