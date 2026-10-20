import { type SQLiteDatabase } from "expo-sqlite";

export const TARGET_DATABASE_VERSION = 2;

export async function migrateDbIfNeeded(db: SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;"
  );
  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= TARGET_DATABASE_VERSION) {
    return;
  }

  // Version 0 to Version 1 (Base Schema)
  if (currentDbVersion === 0) {
    await db.execAsync("PRAGMA journal_mode = WAL;");
    await db.execAsync("PRAGMA foreign_keys = ON;");

    await db.execAsync(`
      -- Athlete Profile
      CREATE TABLE IF NOT EXISTS athlete_profile (
        id TEXT PRIMARY KEY,
        display_name TEXT NOT NULL,
        age INTEGER,
        height REAL,
        current_weight REAL,
        preferred_weight_unit TEXT NOT NULL DEFAULT 'kg',
        preferred_distance_unit TEXT NOT NULL DEFAULT 'cm',
        sex TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      -- Exercises Catalog
      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        equipment TEXT NOT NULL,
        is_custom INTEGER NOT NULL DEFAULT 0
      );

      -- Workout Programs
      CREATE TABLE IF NOT EXISTS programs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        is_template INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      -- Program Days
      CREATE TABLE IF NOT EXISTS program_days (
        id TEXT PRIMARY KEY,
        program_id TEXT NOT NULL,
        weekday TEXT NOT NULL,
        title TEXT NOT NULL,
        session_type TEXT NOT NULL,
        is_rest INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL,
        FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
      );

      -- Program Exercises
      CREATE TABLE IF NOT EXISTS program_exercises (
        id TEXT PRIMARY KEY,
        program_day_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        exercise_name TEXT NOT NULL,
        target_sets INTEGER NOT NULL DEFAULT 3,
        target_reps TEXT NOT NULL DEFAULT '8-10',
        target_rest_seconds INTEGER NOT NULL DEFAULT 90,
        sort_order INTEGER NOT NULL,
        FOREIGN KEY (program_day_id) REFERENCES program_days(id) ON DELETE CASCADE
      );

      -- Workout Sessions History
      CREATE TABLE IF NOT EXISTS workout_sessions (
        id TEXT PRIMARY KEY,
        program_id TEXT,
        program_day_id TEXT,
        session_name TEXT NOT NULL,
        session_type TEXT NOT NULL,
        started_at TEXT NOT NULL,
        completed_at TEXT,
        status TEXT NOT NULL DEFAULT 'completed',
        duration_seconds INTEGER NOT NULL DEFAULT 0,
        notes TEXT NOT NULL DEFAULT ''
      );

      -- Workout Sets History
      CREATE TABLE IF NOT EXISTS workout_sets (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        exercise_name TEXT NOT NULL,
        set_number INTEGER NOT NULL,
        weight REAL NOT NULL,
        reps INTEGER NOT NULL,
        completed INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
      );

      -- Personal Records
      CREATE TABLE IF NOT EXISTS personal_records (
        id TEXT PRIMARY KEY,
        exercise_id TEXT NOT NULL,
        exercise_name TEXT NOT NULL,
        record_type TEXT NOT NULL,
        weight REAL NOT NULL,
        reps INTEGER NOT NULL,
        unit TEXT NOT NULL DEFAULT 'kg',
        achieved_at TEXT NOT NULL,
        notes TEXT NOT NULL DEFAULT ''
      );

      -- Body Measurements
      CREATE TABLE IF NOT EXISTS body_measurements (
        id TEXT PRIMARY KEY,
        measurement_type TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        recorded_at TEXT NOT NULL,
        notes TEXT NOT NULL DEFAULT ''
      );

      -- Boxing Presets
      CREATE TABLE IF NOT EXISTS boxing_presets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        rounds INTEGER NOT NULL,
        work_seconds INTEGER NOT NULL,
        rest_seconds INTEGER NOT NULL,
        prep_seconds INTEGER NOT NULL,
        sound_enabled INTEGER NOT NULL DEFAULT 1,
        haptics_enabled INTEGER NOT NULL DEFAULT 1
      );

      -- Boxing Sessions
      CREATE TABLE IF NOT EXISTS boxing_sessions (
        id TEXT PRIMARY KEY,
        preset_name TEXT NOT NULL,
        completed_rounds INTEGER NOT NULL,
        total_rounds INTEGER NOT NULL,
        work_seconds INTEGER NOT NULL,
        rest_seconds INTEGER NOT NULL,
        started_at TEXT NOT NULL,
        completed_at TEXT NOT NULL,
        notes TEXT NOT NULL DEFAULT ''
      );

      -- Boxing Combinations
      CREATE TABLE IF NOT EXISTS boxing_combinations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        steps_json TEXT NOT NULL,
        is_custom INTEGER NOT NULL DEFAULT 0
      );

      -- Achievements
      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        target_value INTEGER NOT NULL,
        current_value INTEGER NOT NULL DEFAULT 0,
        unlocked_at TEXT
      );

      -- Indexes for fast queries
      CREATE INDEX IF NOT EXISTS idx_workout_sets_session ON workout_sets(session_id);
      CREATE INDEX IF NOT EXISTS idx_pr_exercise ON personal_records(exercise_name);
      CREATE INDEX IF NOT EXISTS idx_measurements_type ON body_measurements(measurement_type);
      CREATE INDEX IF NOT EXISTS idx_program_days ON program_days(program_id);
    `);

    // Seed only static educational content (exercises, boxing presets & combinations, achievement targets)
    await seedStaticContent(db);

    currentDbVersion = 1;
  }

  // Version 1 to Version 2: Purge any initial fake user records
  if (currentDbVersion === 1) {
    await db.execAsync(`
      -- Clean any fake PRs
      DELETE FROM personal_records;
      -- Clean any fake workout sessions and sets
      DELETE FROM workout_sets;
      DELETE FROM workout_sessions;
      -- Clean fake measurements
      DELETE FROM body_measurements;
      -- Reset achievements to locked state
      UPDATE achievements SET current_value = 0, unlocked_at = NULL;
    `);

    // If profile has fake default values, reset it so onboarding appears
    const profile = await db.getFirstAsync<any>(
      "SELECT * FROM athlete_profile WHERE id = 'default-athlete';"
    );
    if (profile && profile.display_name === "Iron Athlete") {
      await db.runAsync("DELETE FROM athlete_profile WHERE id = 'default-athlete';");
    }

    currentDbVersion = 2;
  }

  await db.execAsync(`PRAGMA user_version = ${TARGET_DATABASE_VERSION};`);
}

async function seedStaticContent(db: SQLiteDatabase): Promise<void> {
  // 1. Core Exercise Catalog
  const exercises = [
    ["ex-bench", "Barbell Bench Press", "Göğüs", "Barbell"],
    ["ex-inc-db", "Incline Dumbbell Press", "Üst Göğüs", "Dumbbell"],
    ["ex-squat", "Barbell Back Squat", "Bacak / Quadriceps", "Barbell"],
    ["ex-deadlift", "Conventional Deadlift", "Sırt / Arka Bacak", "Barbell"],
    ["ex-ohp", "Overhead Press (OHP)", "Omuz", "Barbell"],
    ["ex-pullup", "Barfiks (Pull-Up)", "Sırt / Kanat", "Vücut Ağırlığı"],
    ["ex-row", "Barbell Bent-Over Row", "Sırt", "Barbell"],
    ["ex-dip", "Dips (Göğüs & Arka Kol)", "Göğüs / Arka Kol", "Paralel Bar"],
    ["ex-romanian", "Romanian Deadlift", "Hamstrings / Kalça", "Barbell"],
    ["ex-lateral", "Dumbbell Lateral Raise", "Yan Omuz", "Dumbbell"],
  ];

  for (const [id, name, cat, eq] of exercises) {
    await db.runAsync(
      `INSERT OR IGNORE INTO exercises (id, name, category, equipment, is_custom)
       VALUES (?, ?, ?, ?, 0);`,
      [id, name, cat, eq]
    );
  }

  // 2. Bundled Boxing Presets
  const presets = [
    ["b-pre-1", "Profesyonel Şampiyona", 12, 180, 60, 10, 1, 1],
    ["b-pre-2", "Standart Sparring", 6, 180, 60, 10, 1, 1],
    ["b-pre-3", "Ağır Torba Kondisyon", 8, 120, 45, 10, 1, 1],
    ["b-pre-4", "Hız & Gölge Boksu", 4, 120, 30, 10, 1, 1],
  ];

  for (const p of presets) {
    await db.runAsync(
      `INSERT OR IGNORE INTO boxing_presets 
        (id, name, rounds, work_seconds, rest_seconds, prep_seconds, sound_enabled, haptics_enabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      p
    );
  }

  // 3. Bundled Boxing Combinations
  const combos = [
    [
      "c-1",
      "Klasik 1-2 Kombinasyonu",
      "Mesafe ayarlayan sol direkt ardından güçlü sağ düz yumruk.",
      JSON.stringify(["1 - Jab", "2 - Cross"]),
      0,
    ],
    [
      "c-2",
      "Sol Kroşe Tuzağı",
      "Gardı meşgul eden 1-2 vuruşun ardından dışarıdan gelen sol kroşe.",
      JSON.stringify(["1 - Jab", "2 - Cross", "3 - Lead Hook"]),
      0,
    ],
    [
      "c-3",
      "Gövde - Baş Yıkımı",
      "Eskiş ile atağı savuşturup gövdeye patlayıcı aparkat ve başa kroşe.",
      JSON.stringify(["1 - Jab", "Slip Sağ", "6 - Gövde Aparkat", "3 - Kafa Kroşe"]),
      0,
    ],
  ];

  for (const c of combos) {
    await db.runAsync(
      `INSERT OR IGNORE INTO boxing_combinations (id, name, description, steps_json, is_custom)
       VALUES (?, ?, ?, ?, ?);`,
      c
    );
  }

  // 4. Achievement Definitions (all start locked)
  const achievements = [
    ["ach-1", "FIRST_BLOOD", "İlk Adım", "İlk antrenman seansınızı tamamlayın", "flash", 1, 0, null],
    ["ach-2", "CENTURY_SQUAT", "100+ kg Squat", "Squat hareketinde 100 kg ve üzeri rekor kırın", "barbell", 100, 0, null],
    ["ach-3", "TWELVE_ROUNDS", "12 Raunt Şampiyonu", "Boks sayacında tek seansta 12 raunt tamamlayın", "flame", 12, 0, null],
    ["ach-4", "STREAK_4W", "Çelik İrade", "4 hafta üst üste antrenman programını aksatmayın", "trending-up", 4, 0, null],
    ["ach-5", "BENCH_BEAST", "100 kg Bench Press", "Bench press hareketinde 100 kg barajını aşın", "trophy", 100, 0, null],
  ];

  for (const a of achievements) {
    await db.runAsync(
      `INSERT OR IGNORE INTO achievements 
        (id, code, title, description, icon, target_value, current_value, unlocked_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      a
    );
  }
}
