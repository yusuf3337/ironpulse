export interface CatalogExercise {
  id: string;
  name: string;
  nameEn: string;
  muscleGroup: string;
  muscleGroupEn: string;
  equipment: string;
  equipmentEn: string;
}

export const MUSCLE_GROUPS = [
  "Tümü",
  "Göğüs",
  "Sırt",
  "Omuz",
  "Biceps",
  "Triceps",
  "Bacak (Ön/Kalça)",
  "Bacak (Arka/Kalf)",
  "Karın & Merkez",
  "Trapez & Ön Kol",
  "Boks & Kondisyon",
];

export const EQUIPMENT_TYPES = [
  "Tümü",
  "Barbell",
  "Dumbbell",
  "Kablo",
  "Makine",
  "Vücut Ağırlığı",
  "Kardiyo / Boks",
];

export const EXERCISE_CATALOG: CatalogExercise[] = [
  // ==========================================
  // GÖĞÜS (CHEST)
  // ==========================================
  { id: "ch-bar-1", name: "Barbell Bench Press (Düz Sehpa)", nameEn: "Barbell Bench Press", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "ch-bar-2", name: "Incline Barbell Bench Press (Eğimli)", nameEn: "Incline Barbell Bench Press", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "ch-bar-3", name: "Decline Barbell Bench Press (Ters Eğim)", nameEn: "Decline Barbell Bench Press", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "ch-bar-4", name: "Smith Machine Bench Press", nameEn: "Smith Machine Bench Press", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Makine", equipmentEn: "Machine" },
  { id: "ch-bar-5", name: "Smith Machine Incline Press", nameEn: "Smith Machine Incline Press", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Makine", equipmentEn: "Machine" },
  { id: "ch-db-1", name: "Flat Dumbbell Press (Düz Sehpa Dumbbell)", nameEn: "Flat Dumbbell Press", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "ch-db-2", name: "Incline Dumbbell Press (Eğimli Dumbbell)", nameEn: "Incline Dumbbell Press", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "ch-db-3", name: "Decline Dumbbell Press (Ters Eğim Dumbbell)", nameEn: "Decline Dumbbell Press", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "ch-db-4", name: "Flat Dumbbell Fly (Düz Açış)", nameEn: "Flat Dumbbell Fly", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "ch-db-5", name: "Incline Dumbbell Fly (Üst Göğüs Açış)", nameEn: "Incline Dumbbell Fly", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "ch-db-6", name: "Dumbbell Pullover (Göğüs Odaklı)", nameEn: "Dumbbell Pullover", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "ch-cab-1", name: "Cable Crossover (Orta Göğüs)", nameEn: "Cable Crossover", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "ch-cab-2", name: "Low-to-High Cable Fly (Aşağıdan Yukarı Üst Göğüs)", nameEn: "Low-to-High Cable Fly", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "ch-cab-3", name: "High-to-Low Cable Fly (Yukarıdan Aşağı Alt Göğüs)", nameEn: "High-to-Low Cable Fly", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "ch-cab-4", name: "Seated Cable Chest Press (Oturan Kablo Pres)", nameEn: "Seated Cable Chest Press", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "ch-mac-1", name: "Chest Press Makinesi (Machine Press)", nameEn: "Machine Chest Press", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Makine", equipmentEn: "Machine" },
  { id: "ch-mac-2", name: "Incline Chest Press Makinesi", nameEn: "Incline Machine Chest Press", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Makine", equipmentEn: "Machine" },
  { id: "ch-mac-3", name: "Pec Deck Fly (Kelebek Makinesi)", nameEn: "Pec Deck Fly", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Makine", equipmentEn: "Machine" },
  { id: "ch-bw-1", name: "Standart Şınav (Push-Up)", nameEn: "Standard Push-Up", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "ch-bw-2", name: "Decline Push-Up (Ayaklar Yüksekte Şınav)", nameEn: "Decline Push-Up", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "ch-bw-3", name: "Dips (Öne Eğik Göğüs Odaklı)", nameEn: "Chest Dips", muscleGroup: "Göğüs", muscleGroupEn: "Chest", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },

  // ==========================================
  // SIRT (BACK - LATS & MID-BACK)
  // ==========================================
  { id: "bk-bar-1", name: "Barbell Bent-Over Row (Düz Tutuş)", nameEn: "Barbell Bent-Over Row", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "bk-bar-2", name: "Underhand Barbell Row (Yates / Ters Tutuş)", nameEn: "Underhand Barbell Row", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "bk-bar-3", name: "Conventional Deadlift", nameEn: "Conventional Deadlift", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "bk-bar-4", name: "Sumo Deadlift", nameEn: "Sumo Deadlift", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "bk-bar-5", name: "Pendlay Row", nameEn: "Pendlay Row", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "bk-bar-6", name: "T-Bar Row (Barbell Köşede)", nameEn: "T-Bar Row", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "bk-db-1", name: "Tek Kol Dumbbell Row (One-Arm Row)", nameEn: "Single-Arm Dumbbell Row", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "bk-db-2", name: "Chest-Supported Dumbbell Row (Sehpaya Yaslanarak)", nameEn: "Chest-Supported Row", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "bk-db-3", name: "Dumbbell Pullover (Kanat Odaklı)", nameEn: "Lat Pullover", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "bk-cab-1", name: "Lat Pulldown (Geniş Tutuş Kanat)", nameEn: "Wide-Grip Lat Pulldown", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "bk-cab-2", name: "Close-Grip Lat Pulldown (V-Bar Tutuş)", nameEn: "Close-Grip Lat Pulldown", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "bk-cab-3", name: "Reverse-Grip Lat Pulldown (Ters Tutuş)", nameEn: "Reverse-Grip Lat Pulldown", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "bk-cab-4", name: "Seated Cable Row (Oturarak Kürek V-Bar)", nameEn: "Seated Cable Row", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "bk-cab-5", name: "Wide-Grip Seated Cable Row (Geniş Bar Kürek)", nameEn: "Wide-Grip Seated Row", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "bk-cab-6", name: "Straight-Arm Cable Pulldown (Düz Kol Çekiş)", nameEn: "Straight-Arm Pulldown", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "bk-cab-7", name: "Single-Arm Cable Row (Tek Kol Kablo)", nameEn: "Single-Arm Cable Row", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "bk-bw-1", name: "Barfiks (Geniş Tutuş Pull-Up)", nameEn: "Wide-Grip Pull-Up", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "bk-bw-2", name: "Chin-Up (Dar Ters Tutuş Barfiks)", nameEn: "Chin-Up", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "bk-bw-3", name: "Neutral Grip Pull-Up (Avuçlar İçe Dönük Barfiks)", nameEn: "Neutral Grip Pull-Up", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "bk-bw-4", name: "Inverted Row (Avustralya Barfiksi)", nameEn: "Inverted Row", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "bk-bw-5", name: "Hyperextension / Back Extension (Bel Açma)", nameEn: "Hyperextension", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "bk-mac-1", name: "Machine Seated Row (Sırt Makinesi)", nameEn: "Machine Seated Row", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Makine", equipmentEn: "Machine" },
  { id: "bk-mac-2", name: "Iso-Lateral High Row Makinesi", nameEn: "Iso-Lateral High Row", muscleGroup: "Sırt", muscleGroupEn: "Back", equipment: "Makine", equipmentEn: "Machine" },

  // ==========================================
  // OMUZ (SHOULDERS - ANTERIOR/LATERAL/POSTERIOR)
  // ==========================================
  { id: "sh-bar-1", name: "Overhead Press (Ayakta Askeri Pres - OHP)", nameEn: "Standing Overhead Press", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "sh-bar-2", name: "Seated Barbell Overhead Press (Oturarak Bar Omuz)", nameEn: "Seated Barbell Press", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "sh-bar-3", name: "Push Press (Bacak İtişli Omuz Pres)", nameEn: "Push Press", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "sh-bar-4", name: "Barbell Upright Row (Geniş Tutuş Çene Altı)", nameEn: "Barbell Upright Row", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "sh-db-1", name: "Seated Dumbbell Shoulder Press (Oturarak Dumbbell Pres)", nameEn: "Seated Dumbbell Press", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "sh-db-2", name: "Standing Dumbbell Shoulder Press", nameEn: "Standing Dumbbell Press", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "sh-db-3", name: "Arnold Press", nameEn: "Arnold Press", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "sh-db-4", name: "Dumbbell Lateral Raise (Yan Omuz Açış)", nameEn: "Dumbbell Lateral Raise", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "sh-db-5", name: "Seated Dumbbell Lateral Raise (Oturan Yan Omuz)", nameEn: "Seated Lateral Raise", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "sh-db-6", name: "Dumbbell Front Raise (Ön Omuz Kaldırış)", nameEn: "Dumbbell Front Raise", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "sh-db-7", name: "Bent-Over Dumbbell Rear Delt Fly (Arka Omuz Açış)", nameEn: "Rear Delt Fly", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "sh-cab-1", name: "Cable Lateral Raise (Tek Kol Kablo Yan Omuz)", nameEn: "Cable Lateral Raise", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "sh-cab-2", name: "Behind-the-Back Cable Lateral Raise", nameEn: "Behind-the-Back Cable Lateral", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "sh-cab-3", name: "Face Pull (Halat ile Yüze Çekiş - Arka Omuz)", nameEn: "Cable Face Pull", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "sh-cab-4", name: "Cable Front Raise (Halat ile Ön Omuz)", nameEn: "Cable Front Raise", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "sh-mac-1", name: "Machine Shoulder Press (Omuz Pres Makinesi)", nameEn: "Machine Shoulder Press", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Makine", equipmentEn: "Machine" },
  { id: "sh-mac-2", name: "Reverse Pec Deck (Ters Kelebek - Arka Omuz)", nameEn: "Reverse Pec Deck", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Makine", equipmentEn: "Machine" },
  { id: "sh-bw-1", name: "Pike Push-Up (Omuz Şınavı)", nameEn: "Pike Push-Up", muscleGroup: "Omuz", muscleGroupEn: "Shoulders", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },

  // ==========================================
  // BICEPS (ÖN KOL / PAZI)
  // ==========================================
  { id: "bic-bar-1", name: "Düz Barbell Bicep Curl", nameEn: "Barbell Bicep Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "bic-bar-2", name: "EZ-Bar Bicep Curl (Z-Bar Biceps)", nameEn: "EZ-Bar Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "bic-bar-3", name: "EZ-Bar Preacher Curl (Scott Sehpası Z-Bar)", nameEn: "EZ-Bar Preacher Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "bic-db-1", name: "Alternating Dumbbell Curl (Sırayla Çevirerek)", nameEn: "Alternating Dumbbell Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "bic-db-2", name: "Dumbbell Hammer Curl (Çekiç Biceps)", nameEn: "Dumbbell Hammer Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "bic-db-3", name: "Incline Dumbbell Curl (Eğimli Sehpada Biceps)", nameEn: "Incline Dumbbell Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "bic-db-4", name: "Concentration Curl (Dizden Destekli Konsantrasyon)", nameEn: "Concentration Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "bic-db-5", name: "Spider Curl (Göğüs Dayalı Sehpada)", nameEn: "Spider Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "bic-db-6", name: "Tek Kol Dumbbell Preacher Curl", nameEn: "One-Arm Preacher Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "bic-db-7", name: "Zottman Curl (Biceps & Ön Kol Kombosu)", nameEn: "Zottman Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "bic-cab-1", name: "Kablo Bicep Curl (Düz Bar)", nameEn: "Straight-Bar Cable Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "bic-cab-2", name: "Kablo Halatlı Hammer Curl (Rope Hammer)", nameEn: "Cable Rope Hammer Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "bic-cab-3", name: "High Cable Curl (Çift Kablo Herkül)", nameEn: "Overhead Cable Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "bic-cab-4", name: "Tek Kol Kablo Bicep Curl", nameEn: "Single-Arm Cable Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "bic-mac-1", name: "Biceps Curl Makinesi (Machine Curl)", nameEn: "Machine Bicep Curl", muscleGroup: "Biceps", muscleGroupEn: "Biceps", equipment: "Makine", equipmentEn: "Machine" },

  // ==========================================
  // TRICEPS (ARKA KOL)
  // ==========================================
  { id: "tri-cab-1", name: "Tricep Rope Pushdown (Halat ile Aşağı İtiş)", nameEn: "Tricep Rope Pushdown", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "tri-cab-2", name: "Straight-Bar Cable Pushdown (Düz Bar İtiş)", nameEn: "Straight-Bar Pushdown", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "tri-cab-3", name: "V-Bar Cable Pushdown", nameEn: "V-Bar Pushdown", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "tri-cab-4", name: "Overhead Cable Tricep Extension (Kablo ile Baş Arkası)", nameEn: "Cable Overhead Extension", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "tri-cab-5", name: "Tek Kol Ters Tutuş Kablo Pushdown", nameEn: "Reverse-Grip One-Arm Pushdown", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "tri-bar-1", name: "EZ-Bar Skullcrusher (Alna Triceps Z-Bar)", nameEn: "EZ-Bar Skullcrusher", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "tri-bar-2", name: "Close-Grip Bench Press (Dar Tutuş Bench)", nameEn: "Close-Grip Bench Press", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "tri-db-1", name: "Seated Overhead Dumbbell Extension (Çift El Baş Arkası)", nameEn: "Seated Overhead Dumbbell Extension", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "tri-db-2", name: "Tek Kol Dumbbell Overhead Extension", nameEn: "One-Arm Overhead Extension", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "tri-db-3", name: "Dumbbell Tricep Kickback", nameEn: "Dumbbell Kickback", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "tri-db-4", name: "Dumbbell Skullcrusher (Sehpada Çift Dumbbell)", nameEn: "Dumbbell Skullcrusher", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "tri-bw-1", name: "Dips (Paralel Barda Dik Triceps Dips)", nameEn: "Triceps Dips", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "tri-bw-2", name: "Bench Dips (Sehpa Kenarı Dips)", nameEn: "Bench Dips", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "tri-bw-3", name: "Elmas Şınav (Diamond Push-Up)", nameEn: "Diamond Push-Up", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "tri-mac-1", name: "Triceps Extension Makinesi", nameEn: "Machine Tricep Extension", muscleGroup: "Triceps", muscleGroupEn: "Triceps", equipment: "Makine", equipmentEn: "Machine" },

  // ==========================================
  // BACAK (ÖN BACAK & KALÇA - QUADS & GLUTES)
  // ==========================================
  { id: "lg-bar-1", name: "Barbell Back Squat (High Bar)", nameEn: "Barbell Back Squat", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "lg-bar-2", name: "Front Squat (Ön Squat)", nameEn: "Barbell Front Squat", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "lg-bar-3", name: "Barbell Hip Thrust (Kalça İtişi)", nameEn: "Barbell Hip Thrust", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "lg-bar-4", name: "Barbell Walking Lunge", nameEn: "Barbell Walking Lunge", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "lg-bar-5", name: "Box Squat (Kutuya Squat)", nameEn: "Box Squat", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "lg-db-1", name: "Bulgarian Split Squat (Dumbbell)", nameEn: "Bulgarian Split Squat", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "lg-db-2", name: "Dumbbell Goblet Squat", nameEn: "Dumbbell Goblet Squat", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "lg-db-3", name: "Dumbbell Walking Lunge (Dumbbell Lunge)", nameEn: "Dumbbell Walking Lunge", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "lg-db-4", name: "Dumbbell Step-Up (Kutuya Adım)", nameEn: "Dumbbell Step-Up", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "lg-mac-1", name: "Leg Press Makinesi (45 Derece)", nameEn: "Leg Press 45°", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Makine", equipmentEn: "Machine" },
  { id: "lg-mac-2", name: "Hack Squat Makinesi", nameEn: "Hack Squat Machine", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Makine", equipmentEn: "Machine" },
  { id: "lg-mac-3", name: "Leg Extension (Ön Bacak Açış)", nameEn: "Leg Extension", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Makine", equipmentEn: "Machine" },
  { id: "lg-mac-4", name: "Smith Machine Squat", nameEn: "Smith Machine Squat", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Makine", equipmentEn: "Machine" },
  { id: "lg-bw-1", name: "Air Squat (Serbest Çömelme)", nameEn: "Bodyweight Squat", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "lg-bw-2", name: "Glute Bridge (Matta Kalça Köprüsü)", nameEn: "Glute Bridge", muscleGroup: "Bacak (Ön/Kalça)", muscleGroupEn: "Quads & Glutes", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },

  // ==========================================
  // BACAK (ARKA BACAK & KALF - HAMSTRINGS & CALVES)
  // ==========================================
  { id: "hm-bar-1", name: "Romanian Deadlift - RDL (Barbell)", nameEn: "Romanian Deadlift", muscleGroup: "Bacak (Arka/Kalf)", muscleGroupEn: "Hamstrings & Calves", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "hm-bar-2", name: "Stiff-Legged Deadlift (Düz Bacak Deadlift)", nameEn: "Stiff-Legged Deadlift", muscleGroup: "Bacak (Arka/Kalf)", muscleGroupEn: "Hamstrings & Calves", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "hm-bar-3", name: "Good Morning (Sırtta Bar ile Eğilme)", nameEn: "Good Morning", muscleGroup: "Bacak (Arka/Kalf)", muscleGroupEn: "Hamstrings & Calves", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "hm-db-1", name: "Dumbbell Romanian Deadlift (Çift Dumbbell RDL)", nameEn: "Dumbbell RDL", muscleGroup: "Bacak (Arka/Kalf)", muscleGroupEn: "Hamstrings & Calves", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "hm-db-2", name: "Tek Bacak Dumbbell RDL (Single-Leg RDL)", nameEn: "Single-Leg Dumbbell RDL", muscleGroup: "Bacak (Arka/Kalf)", muscleGroupEn: "Hamstrings & Calves", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "hm-mac-1", name: "Lying Leg Curl (Yatarak Arka Bacak)", nameEn: "Lying Leg Curl", muscleGroup: "Bacak (Arka/Kalf)", muscleGroupEn: "Hamstrings & Calves", equipment: "Makine", equipmentEn: "Machine" },
  { id: "hm-mac-2", name: "Seated Leg Curl (Oturarak Arka Bacak)", nameEn: "Seated Leg Curl", muscleGroup: "Bacak (Arka/Kalf)", muscleGroupEn: "Hamstrings & Calves", equipment: "Makine", equipmentEn: "Machine" },
  { id: "hm-mac-3", name: "Standing Calf Raise Makinesi (Ayakta Kalf)", nameEn: "Standing Calf Raise", muscleGroup: "Bacak (Arka/Kalf)", muscleGroupEn: "Hamstrings & Calves", equipment: "Makine", equipmentEn: "Machine" },
  { id: "hm-mac-4", name: "Seated Calf Raise Makinesi (Oturan Kalf)", nameEn: "Seated Calf Raise", muscleGroup: "Bacak (Arka/Kalf)", muscleGroupEn: "Hamstrings & Calves", equipment: "Makine", equipmentEn: "Machine" },
  { id: "hm-mac-5", name: "Leg Press Calf Raise (Leg Presste Kalf)", nameEn: "Leg Press Calf Raise", muscleGroup: "Bacak (Arka/Kalf)", muscleGroupEn: "Hamstrings & Calves", equipment: "Makine", equipmentEn: "Machine" },
  { id: "hm-bw-1", name: "Nordic Hamstring Curl", nameEn: "Nordic Hamstring Curl", muscleGroup: "Bacak (Arka/Kalf)", muscleGroupEn: "Hamstrings & Calves", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "hm-bw-2", name: "Tek Ayak Kalf Kaldırışı (Basamakta)", nameEn: "Single-Leg Calf Raise", muscleGroup: "Bacak (Arka/Kalf)", muscleGroupEn: "Hamstrings & Calves", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },

  // ==========================================
  // KARIN & MERKEZ (CORE / ABS & OBLIQUES)
  // ==========================================
  { id: "cr-bw-1", name: "Plank (Dirsek Üstü Duruş)", nameEn: "Forearm Plank", muscleGroup: "Karın & Merkez", muscleGroupEn: "Core / Abs", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "cr-bw-2", name: "Asılarak Bacak Kaldırma (Hanging Leg Raise)", nameEn: "Hanging Leg Raise", muscleGroup: "Karın & Merkez", muscleGroupEn: "Core / Abs", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "cr-bw-3", name: "Kaptan Köşkünde Diz Çekme (Captain's Chair)", nameEn: "Captain's Chair Knee Raise", muscleGroup: "Karın & Merkez", muscleGroupEn: "Core / Abs", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "cr-bw-4", name: "Ab Wheel Rollout (Karın Tekerleği)", nameEn: "Ab Wheel Rollout", muscleGroup: "Karın & Merkez", muscleGroupEn: "Core / Abs", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "cr-bw-5", name: "Decline Bench Crunch (Eğimli Sehpa Mekik)", nameEn: "Decline Crunch", muscleGroup: "Karın & Merkez", muscleGroupEn: "Core / Abs", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "cr-bw-6", name: "Side Plank (Yan Plank - Oblik)", nameEn: "Side Plank", muscleGroup: "Karın & Merkez", muscleGroupEn: "Core / Abs", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "cr-bw-7", name: "Bisiklet Mekiği (Bicycle Crunch)", nameEn: "Bicycle Crunch", muscleGroup: "Karın & Merkez", muscleGroupEn: "Core / Abs", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "cr-bw-8", name: "L-Sit Hold (Paralel Barlarda)", nameEn: "L-Sit Hold", muscleGroup: "Karın & Merkez", muscleGroupEn: "Core / Abs", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
  { id: "cr-cab-1", name: "Cable Crunch (Halat ile Secde Mekik)", nameEn: "Cable Kneeling Crunch", muscleGroup: "Karın & Merkez", muscleGroupEn: "Core / Abs", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "cr-cab-2", name: "Cable Woodchopper (Kablo Odun Kesme - Oblik)", nameEn: "Cable Woodchopper", muscleGroup: "Karın & Merkez", muscleGroupEn: "Core / Abs", equipment: "Kablo", equipmentEn: "Cable" },
  { id: "cr-db-1", name: "Russian Twist (Ağırlıklı Rus Dönüşü)", nameEn: "Russian Twist", muscleGroup: "Karın & Merkez", muscleGroupEn: "Core / Abs", equipment: "Dumbbell", equipmentEn: "Dumbbell" },

  // ==========================================
  // TRAPEZ & ÖN KOL (TRAPS & FOREARMS)
  // ==========================================
  { id: "trp-bar-1", name: "Barbell Shrug (Barbell Omuz Silkme)", nameEn: "Barbell Shrug", muscleGroup: "Trapez & Ön Kol", muscleGroupEn: "Traps & Forearms", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "trp-db-1", name: "Dumbbell Shrug (Dumbbell Silkme)", nameEn: "Dumbbell Shrug", muscleGroup: "Trapez & Ön Kol", muscleGroupEn: "Traps & Forearms", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "trp-db-2", name: "Farmer's Walk (Ağır Dumbbell Taşıma)", nameEn: "Farmer's Walk", muscleGroup: "Trapez & Ön Kol", muscleGroupEn: "Traps & Forearms", equipment: "Dumbbell", equipmentEn: "Dumbbell" },
  { id: "trp-bar-2", name: "Barbell Wrist Curl (Bilek Bükme)", nameEn: "Barbell Wrist Curl", muscleGroup: "Trapez & Ön Kol", muscleGroupEn: "Traps & Forearms", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "trp-bar-3", name: "Reverse Barbell Wrist Curl (Ters Bilek)", nameEn: "Reverse Wrist Curl", muscleGroup: "Trapez & Ön Kol", muscleGroupEn: "Traps & Forearms", equipment: "Barbell", equipmentEn: "Barbell" },
  { id: "trp-bw-1", name: "Dead Hang (Barfikste Asılı Kalma - Kavrama)", nameEn: "Dead Hang", muscleGroup: "Trapez & Ön Kol", muscleGroupEn: "Traps & Forearms", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },

  // ==========================================
  // BOKS & KONDİSYON (BOXING & CARDIO)
  // ==========================================
  { id: "bx-1", name: "Gölge Boksu (Shadowboxing - Kombinasyon & Ayak İşi)", nameEn: "Shadowboxing Rounds", muscleGroup: "Boks & Kondisyon", muscleGroupEn: "Boxing & Cardio", equipment: "Kardiyo / Boks", equipmentEn: "Cardio" },
  { id: "bx-2", name: "Ağır Kum Torbası (Heavy Bag Güç Rauntları)", nameEn: "Heavy Bag Power Rounds", muscleGroup: "Boks & Kondisyon", muscleGroupEn: "Boxing & Cardio", equipment: "Kardiyo / Boks", equipmentEn: "Cardio" },
  { id: "bx-3", name: "Hız Topu (Speed Bag Zamanlama)", nameEn: "Speed Bag Work", muscleGroup: "Boks & Kondisyon", muscleGroupEn: "Boxing & Cardio", equipment: "Kardiyo / Boks", equipmentEn: "Cardio" },
  { id: "bx-4", name: "Çift Uçlu Refleks Topu (Double-End Bag)", nameEn: "Double-End Bag", muscleGroup: "Boks & Kondisyon", muscleGroupEn: "Boxing & Cardio", equipment: "Kardiyo / Boks", equipmentEn: "Cardio" },
  { id: "bx-5", name: "İp Atlama (Jump Rope - Boksör Ritmi)", nameEn: "Jump Rope Rounds", muscleGroup: "Boks & Kondisyon", muscleGroupEn: "Boxing & Cardio", equipment: "Kardiyo / Boks", equipmentEn: "Cardio" },
  { id: "bx-6", name: "Sprint İnterval Koşusu (HIIT Sprints)", nameEn: "HIIT Sprints", muscleGroup: "Boks & Kondisyon", muscleGroupEn: "Boxing & Cardio", equipment: "Kardiyo / Boks", equipmentEn: "Cardio" },
  { id: "bx-7", name: "Kürek Makinesi Sprint (Rowing Machine)", nameEn: "Rowing Machine Sprints", muscleGroup: "Boks & Kondisyon", muscleGroupEn: "Boxing & Cardio", equipment: "Kardiyo / Boks", equipmentEn: "Cardio" },
  { id: "bx-8", name: "Assault AirBike Seansı", nameEn: "AirBike Cardio", muscleGroup: "Boks & Kondisyon", muscleGroupEn: "Boxing & Cardio", equipment: "Kardiyo / Boks", equipmentEn: "Cardio" },
  { id: "bx-9", name: "Burpee & Sprawl Kondisyonu", nameEn: "Burpee Conditioning", muscleGroup: "Boks & Kondisyon", muscleGroupEn: "Boxing & Cardio", equipment: "Vücut Ağırlığı", equipmentEn: "Bodyweight" },
];
