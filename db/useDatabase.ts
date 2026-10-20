import { useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { ProfileRepository } from "./repositories/profileRepo";
import { WorkoutRepository } from "./repositories/workoutRepo";
import { PersonalRecordRepository } from "./repositories/prRepo";
import { BoxingRepository } from "./repositories/boxingRepo";
import { BackupRepository } from "./repositories/backupRepo";

export function useDatabase() {
  const db = useSQLiteContext();

  return useMemo(() => {
    return {
      db,
      profile: new ProfileRepository(db),
      workouts: new WorkoutRepository(db),
      prs: new PersonalRecordRepository(db),
      boxing: new BoxingRepository(db),
      backup: new BackupRepository(db),
    };
  }, [db]);
}
