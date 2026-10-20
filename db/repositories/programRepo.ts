import { type SQLiteDatabase } from "expo-sqlite";
import { ProgramDay, ProgramExercise } from "../schema";
import { EXERCISE_CATALOG } from "@/constants/exerciseCatalog";

export interface DayRoutine {
  weekday: string;
  title: string;
  sessionType: string;
  isRest: boolean;
  exercises: Array<{
    id: string;
    exerciseId: string;
    exerciseName: string;
    targetSets: number;
    targetReps: string;
    targetRestSeconds: number;
  }>;
}

export class ProgramRepository {
  constructor(private db: SQLiteDatabase) {}

  async getDayRoutine(weekday: string): Promise<DayRoutine> {
    const dayRow = await this.db.getFirstAsync<any>(
      `SELECT * FROM program_days 
       WHERE program_id = 'active-program' AND weekday = ? 
       LIMIT 1;`,
      [weekday]
    );

    if (!dayRow) {
      // Default empty day
      return {
        weekday,
        title: weekday === "wed" || weekday === "sun" ? "Dinlenme Günü" : "Antrenman Günü",
        sessionType: weekday === "wed" || weekday === "sun" ? "Rest" : "Custom",
        isRest: weekday === "wed" || weekday === "sun",
        exercises: [],
      };
    }

    const exRows = await this.db.getAllAsync<any>(
      `SELECT * FROM program_exercises 
       WHERE program_day_id = ? 
       ORDER BY sort_order ASC;`,
      [dayRow.id]
    );

    return {
      weekday: dayRow.weekday,
      title: dayRow.title,
      sessionType: dayRow.session_type,
      isRest: Boolean(dayRow.is_rest),
      exercises: exRows.map((e) => ({
        id: e.id,
        exerciseId: e.exercise_id,
        exerciseName: e.exercise_name,
        targetSets: e.target_sets,
        targetReps: e.target_reps,
        targetRestSeconds: e.target_rest_seconds,
      })),
    };
  }

  async saveDayRoutine(
    weekday: string,
    title: string,
    isRest: boolean,
    exercises: Array<{
      exerciseId: string;
      exerciseName: string;
      targetSets: number;
      targetReps: string;
    }>
  ): Promise<void> {
    const dayId = `day-${weekday}`;

    await this.db.withTransactionAsync(async () => {
      // Ensure active-program exists
      await this.db.runAsync(
        `INSERT OR IGNORE INTO programs (id, name, description, is_template, is_active, created_at, updated_at)
         VALUES ('active-program', 'Özel Haftalık Program', 'Kullanıcının oluşturduğu antrenman programı', 0, 1, datetime('now'), datetime('now'));`
      );

      // Save day info
      await this.db.runAsync(
        `INSERT OR REPLACE INTO program_days 
          (id, program_id, weekday, title, session_type, is_rest, sort_order)
         VALUES (?, 'active-program', ?, ?, ?, ?, 0);`,
        [dayId, weekday, title, isRest ? "Rest" : "Custom", isRest ? 1 : 0]
      );

      // Clear existing exercises for this day
      await this.db.runAsync(
        "DELETE FROM program_exercises WHERE program_day_id = ?;",
        [dayId]
      );

      // Insert new exercises
      if (!isRest) {
        for (let i = 0; i < exercises.length; i++) {
          const ex = exercises[i];
          const exId = `p-ex-${weekday}-${i}-${Date.now()}`;
          await this.db.runAsync(
            `INSERT INTO program_exercises 
              (id, program_day_id, exercise_id, exercise_name, target_sets, target_reps, target_rest_seconds, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, 90, ?);`,
            [exId, dayId, ex.exerciseId, ex.exerciseName, ex.targetSets, ex.targetReps, i]
          );
        }
      }
    });
  }

  async applyTemplate(templateKey: "upper_lower" | "ppl" | "full_body"): Promise<void> {
    const templates = {
      upper_lower: [
        {
          weekday: "mon",
          title: "Üst Vücut (Upper 1)",
          isRest: false,
          exercises: [
            { exerciseId: "ch-bar-1", exerciseName: "Barbell Bench Press", targetSets: 4, targetReps: "6-8" },
            { exerciseId: "bk-bar-1", exerciseName: "Barbell Bent-Over Row", targetSets: 4, targetReps: "8-10" },
            { exerciseId: "sh-bar-1", exerciseName: "Overhead Press (Ayakta OHP)", targetSets: 3, targetReps: "8" },
            { exerciseId: "bk-bw-1", exerciseName: "Barfiks (Geniş Tutuş Pull-Up)", targetSets: 3, targetReps: "8-10" },
          ],
        },
        {
          weekday: "tue",
          title: "Alt Vücut (Lower 1)",
          isRest: false,
          exercises: [
            { exerciseId: "lg-bar-1", exerciseName: "Barbell Back Squat", targetSets: 4, targetReps: "6-8" },
            { exerciseId: "lg-bar-3", exerciseName: "Romanian Deadlift (RDL)", targetSets: 3, targetReps: "8-10" },
            { exerciseId: "lg-mac-1", exerciseName: "Leg Press Makinesi", targetSets: 3, targetReps: "10-12" },
            { exerciseId: "lg-mac-4", exerciseName: "Standing Calf Raise (Kalf)", targetSets: 4, targetReps: "12-15" },
          ],
        },
        { weekday: "wed", title: "Aktif Dinlenme", isRest: true, exercises: [] },
        {
          weekday: "thu",
          title: "Üst Vücut (Upper 2)",
          isRest: false,
          exercises: [
            { exerciseId: "ch-db-2", exerciseName: "Incline Dumbbell Press", targetSets: 4, targetReps: "8-10" },
            { exerciseId: "bk-cab-1", exerciseName: "Lat Pulldown (Geniş Tutuş)", targetSets: 4, targetReps: "10-12" },
            { exerciseId: "sh-db-3", exerciseName: "Dumbbell Lateral Raise (Yan Omuz)", targetSets: 4, targetReps: "12-15" },
            { exerciseId: "arm-tri-1", exerciseName: "Tricep Rope Pushdown", targetSets: 3, targetReps: "12" },
          ],
        },
        {
          weekday: "fri",
          title: "Alt Vücut (Lower 2)",
          isRest: false,
          exercises: [
            { exerciseId: "bk-bar-2", exerciseName: "Conventional Deadlift", targetSets: 3, targetReps: "5" },
            { exerciseId: "lg-db-1", exerciseName: "Bulgarian Split Squat", targetSets: 3, targetReps: "10" },
            { exerciseId: "lg-mac-2", exerciseName: "Leg Extension (Ön Bacak)", targetSets: 3, targetReps: "12" },
            { exerciseId: "lg-mac-3", exerciseName: "Lying Leg Curl (Arka Bacak)", targetSets: 3, targetReps: "12" },
          ],
        },
        {
          weekday: "sat",
          title: "Boks & Kondisyon",
          isRest: false,
          exercises: [
            { exerciseId: "bx-1", exerciseName: "Gölge Boksu (Shadowboxing)", targetSets: 4, targetReps: "3 dk" },
            { exerciseId: "bx-2", exerciseName: "Ağır Kum Torbası Seansı (Heavy Bag)", targetSets: 6, targetReps: "3 dk" },
            { exerciseId: "bx-3", exerciseName: "İp Atlama (Jump Rope)", targetSets: 3, targetReps: "2 dk" },
          ],
        },
        { weekday: "sun", title: "Tam Dinlenme", isRest: true, exercises: [] },
      ],
      ppl: [
        {
          weekday: "mon",
          title: "İtiş (Push)",
          isRest: false,
          exercises: [
            { exerciseId: "ch-bar-1", exerciseName: "Barbell Bench Press", targetSets: 4, targetReps: "6-8" },
            { exerciseId: "ch-db-2", exerciseName: "Incline Dumbbell Press", targetSets: 3, targetReps: "8-10" },
            { exerciseId: "sh-bar-1", exerciseName: "Overhead Press (Ayakta OHP)", targetSets: 3, targetReps: "8" },
            { exerciseId: "sh-db-3", exerciseName: "Dumbbell Lateral Raise (Yan Omuz)", targetSets: 4, targetReps: "12-15" },
            { exerciseId: "arm-tri-1", exerciseName: "Tricep Rope Pushdown", targetSets: 3, targetReps: "12" },
          ],
        },
        {
          weekday: "tue",
          title: "Çekiş (Pull)",
          isRest: false,
          exercises: [
            { exerciseId: "bk-bar-2", exerciseName: "Conventional Deadlift", targetSets: 3, targetReps: "5" },
            { exerciseId: "bk-bar-1", exerciseName: "Barbell Bent-Over Row", targetSets: 4, targetReps: "8" },
            { exerciseId: "bk-cab-1", exerciseName: "Lat Pulldown (Geniş Tutuş)", targetSets: 3, targetReps: "10-12" },
            { exerciseId: "sh-cab-2", exerciseName: "Face Pull (Halat ile)", targetSets: 4, targetReps: "12-15" },
            { exerciseId: "arm-bic-1", exerciseName: "Barbell Bicep Curl", targetSets: 3, targetReps: "10-12" },
          ],
        },
        {
          weekday: "wed",
          title: "Bacak (Legs)",
          isRest: false,
          exercises: [
            { exerciseId: "lg-bar-1", exerciseName: "Barbell Back Squat", targetSets: 4, targetReps: "6-8" },
            { exerciseId: "lg-bar-3", exerciseName: "Romanian Deadlift (RDL)", targetSets: 3, targetReps: "8-10" },
            { exerciseId: "lg-mac-1", exerciseName: "Leg Press Makinesi", targetSets: 3, targetReps: "10-12" },
            { exerciseId: "lg-mac-4", exerciseName: "Standing Calf Raise (Kalf)", targetSets: 4, targetReps: "15" },
          ],
        },
        {
          weekday: "thu",
          title: "İtiş (Push 2)",
          isRest: false,
          exercises: [
            { exerciseId: "ch-db-1", exerciseName: "Flat Dumbbell Press", targetSets: 4, targetReps: "8-10" },
            { exerciseId: "ch-bw-2", exerciseName: "Dips (Göğüs Odaklı)", targetSets: 3, targetReps: "10" },
            { exerciseId: "sh-db-1", exerciseName: "Seated Dumbbell Shoulder Press", targetSets: 3, targetReps: "8-10" },
            { exerciseId: "arm-tri-2", exerciseName: "EZ-Bar Skullcrusher (Alna Triceps)", targetSets: 3, targetReps: "10" },
          ],
        },
        {
          weekday: "fri",
          title: "Çekiş (Pull 2)",
          isRest: false,
          exercises: [
            { exerciseId: "bk-bw-1", exerciseName: "Barfiks (Geniş Tutuş Pull-Up)", targetSets: 4, targetReps: "8" },
            { exerciseId: "bk-db-1", exerciseName: "Tek Kol Dumbbell Row", targetSets: 3, targetReps: "10" },
            { exerciseId: "bk-cab-2", exerciseName: "Seated Cable Row", targetSets: 3, targetReps: "10-12" },
            { exerciseId: "arm-bic-2", exerciseName: "Dumbbell Hammer Curl", targetSets: 3, targetReps: "10-12" },
          ],
        },
        {
          weekday: "sat",
          title: "Bacak & Boks",
          isRest: false,
          exercises: [
            { exerciseId: "lg-bar-1", exerciseName: "Barbell Back Squat", targetSets: 3, targetReps: "8" },
            { exerciseId: "bx-2", exerciseName: "Ağır Kum Torbası Seansı (Heavy Bag)", targetSets: 5, targetReps: "3 dk" },
          ],
        },
        { weekday: "sun", title: "Tam Dinlenme", isRest: true, exercises: [] },
      ],
      full_body: [
        {
          weekday: "mon",
          title: "Tüm Vücut - Kuvvet (Full Body A)",
          isRest: false,
          exercises: [
            { exerciseId: "lg-bar-1", exerciseName: "Barbell Back Squat", targetSets: 3, targetReps: "6" },
            { exerciseId: "ch-bar-1", exerciseName: "Barbell Bench Press", targetSets: 3, targetReps: "6" },
            { exerciseId: "bk-bar-1", exerciseName: "Barbell Bent-Over Row", targetSets: 3, targetReps: "8" },
            { exerciseId: "cr-1", exerciseName: "Plank", targetSets: 3, targetReps: "60 sn" },
          ],
        },
        { weekday: "tue", title: "Dinlenme", isRest: true, exercises: [] },
        {
          weekday: "wed",
          title: "Tüm Vücut - Hacim (Full Body B)",
          isRest: false,
          exercises: [
            { exerciseId: "bk-bar-2", exerciseName: "Conventional Deadlift", targetSets: 3, targetReps: "5" },
            { exerciseId: "sh-bar-1", exerciseName: "Overhead Press (Ayakta OHP)", targetSets: 3, targetReps: "8" },
            { exerciseId: "bk-bw-1", exerciseName: "Barfiks (Geniş Tutuş Pull-Up)", targetSets: 3, targetReps: "8" },
            { exerciseId: "ch-bw-2", exerciseName: "Dips (Göğüs Odaklı)", targetSets: 3, targetReps: "10" },
          ],
        },
        { weekday: "thu", title: "Dinlenme", isRest: true, exercises: [] },
        {
          weekday: "fri",
          title: "Tüm Vücut - Hipertrofi (Full Body C)",
          isRest: false,
          exercises: [
            { exerciseId: "lg-bar-3", exerciseName: "Romanian Deadlift (RDL)", targetSets: 3, targetReps: "8-10" },
            { exerciseId: "ch-db-2", exerciseName: "Incline Dumbbell Press", targetSets: 3, targetReps: "10" },
            { exerciseId: "bk-cab-1", exerciseName: "Lat Pulldown (Geniş Tutuş)", targetSets: 3, targetReps: "10-12" },
            { exerciseId: "sh-db-3", exerciseName: "Dumbbell Lateral Raise (Yan Omuz)", targetSets: 3, targetReps: "12-15" },
          ],
        },
        {
          weekday: "sat",
          title: "Boks & Kondisyon",
          isRest: false,
          exercises: [
            { exerciseId: "bx-1", exerciseName: "Gölge Boksu (Shadowboxing)", targetSets: 4, targetReps: "3 dk" },
            { exerciseId: "bx-2", exerciseName: "Ağır Kum Torbası Seansı (Heavy Bag)", targetSets: 5, targetReps: "3 dk" },
          ],
        },
        { weekday: "sun", title: "Tam Dinlenme", isRest: true, exercises: [] },
      ],
    };

    const daysToApply = templates[templateKey];
    for (const d of daysToApply) {
      await this.saveDayRoutine(d.weekday, d.title, d.isRest, d.exercises);
    }
  }
}
