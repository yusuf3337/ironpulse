import { type SQLiteDatabase } from "expo-sqlite";

export const TARGET_DATABASE_VERSION = 1;

export async function migrateDbIfNeeded(db: SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;"
  );
  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= TARGET_DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    // Enable WAL mode & foreign keys
    await db.execAsync("PRAGMA journal_mode = WAL;");
    await db.execAsync("PRAGMA foreign_keys = ON;");

    // Version 1 Schema
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

      -- Indexes for performance
      CREATE INDEX IF NOT EXISTS idx_workout_sets_session ON workout_sets(session_id);
      CREATE INDEX IF NOT EXISTS idx_pr_exercise ON personal_records(exercise_name);
      CREATE INDEX IF NOT EXISTS idx_measurements_type ON body_measurements(measurement_type);
      CREATE INDEX IF NOT EXISTS idx_program_days ON program_days(program_id);
    `);

    // Populate Initial Seed Data
    await seedInitialData(db);

    currentDbVersion = 1;
    await db.execAsync(`PRAGMA user_version = ${TARGET_DATABASE_VERSION};`);
  }
}

async function seedInitialData(db: SQLiteDatabase): Promise<void> {
  const now = new Date().toISOString();

  // 1. Initial Athlete Profile
  await db.runAsync(
    `INSERT OR IGNORE INTO athlete_profile 
      (id, display_name, age, height, current_weight, preferred_weight_unit, preferred_distance_unit, sex, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    ["default-athlete", "Iron Athlete", 28, 180, 82.5, "kg", "cm", "male", now, now]
  );

  // 2. Core Exercises Catalog
  const exercises = [
    ["ex-bench", "Barbell Bench Press", "Chest", "Barbell"],
    ["ex-inc-db", "Incline Dumbbell Press", "Chest", "Dumbbells"],
    ["ex-squat", "Barbell Back Squat", "Legs", "Barbell"],
    ["ex-deadlift", "Conventional Deadlift", "Back", "Barbell"],
    ["ex-ohp", "Overhead Press (OHP)", "Shoulders", "Barbell"],
    ["ex-pullup", "Weighted Pull-Up", "Back", "Bodyweight / Belt"],
    ["ex-row", "Barbell Bent-Over Row", "Back", "Barbell"],
    ["ex-dip", "Weighted Dip", "Chest / Triceps", "Parallel Bars"],
    ["ex-romanian", "Romanian Deadlift", "Hamstrings", "Barbell"],
    ["ex-lateral", "Dumbbell Lateral Raise", "Shoulders", "Dumbbells"],
  ];

  for (const [id, name, cat, eq] of exercises) {
    await db.runAsync(
      `INSERT OR IGNORE INTO exercises (id, name, category, equipment, is_custom)
       VALUES (?, ?, ?, ?, 0);`,
      [id, name, cat, eq]
    );
  }

  // 3. Prebuilt Boxing Presets
  const presets = [
    ["b-pre-1", "Pro Championship", 12, 180, 60, 10, 1, 1],
    ["b-pre-2", "Standard Sparring", 6, 180, 60, 10, 1, 1],
    ["b-pre-3", "Heavy Bag Conditioning", 8, 120, 45, 10, 1, 1],
    ["b-pre-4", "Speed & Shadowboxing", 4, 120, 30, 10, 1, 1],
  ];

  for (const p of presets) {
    await db.runAsync(
      `INSERT OR IGNORE INTO boxing_presets 
        (id, name, rounds, work_seconds, rest_seconds, prep_seconds, sound_enabled, haptics_enabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      p
    );
  }

  // 4. Bundled Boxing Combinations
  const combos = [
    [
      "c-1",
      "The Classic 1-2",
      "Fundamental distance finder followed by a straight rear power cross.",
      JSON.stringify(["1 - Jab", "2 - Cross"]),
      0,
    ],
    [
      "c-2",
      "Power Hook Trap",
      "Jab to obscure vision, cross through guard, lead hook around the side.",
      JSON.stringify(["1 - Jab", "2 - Cross", "3 - Lead Hook"]),
      0,
    ],
    [
      "c-3",
      "Body-Head Destruction",
      "Slip outside the jab, blast a power uppercut, finish upstairs.",
      JSON.stringify(["1 - Jab", "Slip Right", "6 - Body Uppercut", "3 - Lead Hook"]),
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

  // 5. Achievements
  const achievements = [
    ["ach-1", "FIRST_BLOOD", "First Workout", "Complete your first logged workout session", "flash", 1, 1, now],
    ["ach-2", "CENTURY_SQUAT", "Century Squatter", "Record a squat of 100 kg or greater", "barbell", 100, 100, now],
    ["ach-3", "TWELVE_ROUNDS", "Championship Distance", "Survive 12 rounds in the Boxing Lab", "flame", 12, 12, now],
    ["ach-4", "STREAK_4W", "Iron Discipline", "Train 4 consecutive weeks without missing a scheduled day", "trending-up", 4, 3, null],
    ["ach-5", "BENCH_BEAST", "Heavy Presser", "Bench press over 100 kg", "trophy", 100, 120, now],
  ];

  for (const a of achievements) {
    await db.runAsync(
      `INSERT OR IGNORE INTO achievements 
        (id, code, title, description, icon, target_value, current_value, unlocked_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      a
    );
  }

  // 6. Initial Personal Records
  const prs = [
    ["pr-1", "ex-bench", "Barbell Bench Press", "heaviest_weight", 120, 3, "kg", now, "Solid RPE 9"],
    ["pr-2", "ex-squat", "Barbell Back Squat", "heaviest_weight", 160, 5, "kg", now, "Deep below parallel"],
    ["pr-3", "ex-deadlift", "Conventional Deadlift", "heaviest_weight", 200, 1, "kg", now, "Smooth lockout"],
    ["pr-4", "ex-ohp", "Overhead Press (OHP)", "heaviest_weight", 75, 4, "kg", now, "Strict form"],
  ];

  for (const pr of prs) {
    await db.runAsync(
      `INSERT OR IGNORE INTO personal_records 
        (id, exercise_id, exercise_name, record_type, weight, reps, unit, achieved_at, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      pr
    );
  }
}
