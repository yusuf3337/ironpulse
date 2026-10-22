import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { useAlert } from "@/context/AlertModalContext";
import { useDatabase } from "@/db/useDatabase";

interface ExerciseSet {
  id: string;
  setNumber: number;
  weight: string;
  reps: string;
  completed: boolean;
}

interface WorkoutExercise {
  id: string;
  name: string;
  category: string;
  previousBest: string;
  sets: ExerciseSet[];
}

export default function ActiveWorkoutScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const { showAlert, showConfirm } = useAlert();
  const { workouts: workoutRepo, prs: prRepo, programs: programRepo } = useDatabase();

  const [sessionTitle, setSessionTitle] = useState<string>("Antrenman Seansı");
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadTodayRoutine();
  }, []);

  const loadTodayRoutine = async () => {
    try {
      const weekdaysKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      const currentDayKey = weekdaysKeys[new Date().getDay()];

      const routine = await programRepo.getDayRoutine(currentDayKey);
      setSessionTitle(routine.title || (language === "tr" ? "Antrenman Seansı" : "Workout Session"));

      if (routine.exercises && routine.exercises.length > 0) {
        const loaded: WorkoutExercise[] = [];
        for (const ex of routine.exercises) {
          const prev = await workoutRepo.getPreviousBest(ex.exerciseName);
          const setsCount = ex.targetSets || 3;
          const initialSets: ExerciseSet[] = [];

          for (let s = 1; s <= setsCount; s++) {
            initialSets.push({
              id: `s-${ex.exerciseId}-${s}`,
              setNumber: s,
              weight: prev ? String(prev.weight) : "",
              reps: prev ? String(prev.reps) : "10",
              completed: false,
            });
          }

          loaded.push({
            id: ex.exerciseId,
            name: ex.exerciseName,
            category: "Egzersiz",
            previousBest: prev
              ? `${prev.weight} kg × ${prev.reps} tekrar`
              : language === "tr" ? "Kayıt Yok" : "No Records",
            sets: initialSets,
          });
        }
        setExercises(loaded);
      } else {
        // Fallback default exercises if user hasn't customized today yet
        setExercises([
          {
            id: "ch-bar-1",
            name: "Barbell Bench Press",
            category: "Göğüs",
            previousBest: language === "tr" ? "İlk Set" : "Initial",
            sets: [
              { id: "s-1", setNumber: 1, weight: "", reps: "10", completed: false },
              { id: "s-2", setNumber: 2, weight: "", reps: "8", completed: false },
              { id: "s-3", setNumber: 3, weight: "", reps: "6", completed: false },
            ],
          },
          {
            id: "bk-bar-1",
            name: "Barbell Bent-Over Row",
            category: "Sırt",
            previousBest: language === "tr" ? "İlk Set" : "Initial",
            sets: [
              { id: "s-4", setNumber: 1, weight: "", reps: "10", completed: false },
              { id: "s-5", setNumber: 2, weight: "", reps: "8", completed: false },
            ],
          },
        ]);
      }
      setIsLoaded(true);
    } catch (err) {
      console.error("Failed to load today routine:", err);
      setIsLoaded(true);
    }
  };

  const currentExercise = exercises[activeExerciseIndex];

  const handleClose = () => {
    showConfirm({
      title: t("activeSession"),
      message:
        language === "tr"
          ? "Mevcut antrenmandan çıkmak istediğinize emin misiniz? Kaydedilmemiş setler kaybolabilir."
          : "Are you sure you want to exit this workout session?",
      type: "warning",
      confirmText: language === "tr" ? "Çık" : "Exit",
      cancelText: t("cancel"),
      onConfirm: () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/(tabs)/train");
        }
      },
    });
  };

  const handleToggleSet = (setId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExercises((prev) =>
      prev.map((ex, idx) => {
        if (idx !== activeExerciseIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) =>
            s.id === setId ? { ...s, completed: !s.completed } : s
          ),
        };
      })
    );
  };

  const handleUpdateSetWeight = (setId: string, val: string) => {
    setExercises((prev) =>
      prev.map((ex, idx) => {
        if (idx !== activeExerciseIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, weight: val } : s)),
        };
      })
    );
  };

  const handleUpdateSetReps = (setId: string, val: string) => {
    setExercises((prev) =>
      prev.map((ex, idx) => {
        if (idx !== activeExerciseIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, reps: val } : s)),
        };
      })
    );
  };

  const handleAddSet = () => {
    if (!currentExercise) return;
    const newSetNumber = currentExercise.sets.length + 1;
    const lastSet = currentExercise.sets[currentExercise.sets.length - 1];

    setExercises((prev) =>
      prev.map((ex, idx) => {
        if (idx !== activeExerciseIndex) return ex;
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              id: `s-${ex.id}-${newSetNumber}-${Date.now()}`,
              setNumber: newSetNumber,
              weight: lastSet ? lastSet.weight : "",
              reps: lastSet ? lastSet.reps : "10",
              completed: false,
            },
          ],
        };
      })
    );
  };

  const handleFinish = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const now = new Date().toISOString();
      const allSetsToSave: Array<{
        exerciseId: string;
        exerciseName: string;
        setNumber: number;
        weight: number;
        reps: number;
        completed: boolean;
        createdAt: string;
      }> = [];

      for (const ex of exercises) {
        for (const s of ex.sets) {
          if (s.completed) {
            const weightNum = parseFloat(s.weight) || 0;
            const repsNum = parseInt(s.reps, 10) || 0;

            allSetsToSave.push({
              exerciseId: ex.id,
              exerciseName: ex.name,
              setNumber: s.setNumber,
              weight: weightNum,
              reps: repsNum,
              completed: true,
              createdAt: now,
            });

            // Auto-check and record PR if this set is highest!
            if (weightNum > 0 && repsNum > 0) {
              await prRepo.checkAndSavePR(ex.id, ex.name, weightNum, repsNum, "kg");
            }
          }
        }
      }

      if (allSetsToSave.length > 0) {
        await workoutRepo.saveCompletedSession(
          {
            programId: null,
            programDayId: null,
            sessionName: sessionTitle,
            sessionType: "Workout",
            startedAt: now,
            completedAt: now,
            status: "completed",
            durationSeconds: 2700,
            notes: "Kaydedilen seans",
          },
          allSetsToSave
        );
      }

      showAlert({
        title: t("finish"),
        message: t("workoutFinishedAlert"),
        type: "success",
        confirmText: language === "tr" ? "Harika!" : "Awesome!",
        onConfirm: () => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/(tabs)/train");
          }
        },
      });
    } catch (err: any) {
      showAlert({
        title: "Hata",
        message: err.message || "Failed to save workout session",
        type: "danger",
      });
    }
  };

  if (!isLoaded || !currentExercise) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-sm font-bold text-textSecondary">{t("loading")}</Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background justify-between"
      style={{
        paddingTop: Math.max(insets.top, 24) + 6,
        paddingBottom: Math.max(insets.bottom, 16),
      }}
    >
      {/* Top Bar with guaranteed clearance and touch targets */}
      <View className="flex-row items-center justify-between px-4 pb-3 border-b border-surfaceBorder">
        <Pressable
          onPress={handleClose}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface border border-surfaceBorder active:opacity-75"
        >
          <Ionicons name="close" size={20} color="#F4F4F6" />
        </Pressable>
        <View className="items-center flex-1 mx-2">
          <Text className="text-[10px] font-bold text-primary uppercase tracking-widest">
            {t("activeSession")}
          </Text>
          <Text className="text-sm font-black text-textPrimary" numberOfLines={1}>
            {sessionTitle}
          </Text>
        </View>
        <Button
          title={t("finishWorkout")}
          size="sm"
          variant="primary"
          onPress={handleFinish}
        />
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Exercise Header */}
        <Card variant="highlight" className="p-4 mb-4">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
              {t("exerciseOf")} {activeExerciseIndex + 1} / {exercises.length}
            </Text>
            <Text className="text-xs font-semibold text-textSecondary">
              {currentExercise.category}
            </Text>
          </View>
          <Text className="text-2xl font-black text-textPrimary mb-2">
            {currentExercise.name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="ribbon-outline" size={14} color="#E5A93C" />
            <Text className="ml-1 text-xs text-gold font-medium">
              {t("previousBest")}: {currentExercise.previousBest}
            </Text>
          </View>
        </Card>

        {/* Set Logger Table with live weight & reps inputs */}
        <View className="mb-4">
          <View className="flex-row px-2 mb-2 items-center">
            <Text className="w-12 text-[10px] font-bold uppercase tracking-wider text-textMuted">
              {t("setCol")}
            </Text>
            <Text className="flex-1 text-center text-[10px] font-bold uppercase tracking-wider text-textMuted">
              {t("weightCol")}
            </Text>
            <Text className="flex-1 text-center text-[10px] font-bold uppercase tracking-wider text-textMuted">
              {t("repsCol")}
            </Text>
            <Text className="w-16 text-right text-[10px] font-bold uppercase tracking-wider text-textMuted">
              {t("statusCol")}
            </Text>
          </View>

          <View className="gap-2">
            {currentExercise.sets.map((set) => (
              <View
                key={set.id}
                className={`flex-row items-center p-2.5 rounded-xl border ${
                  set.completed
                    ? "bg-primary/10 border-primary/40"
                    : "bg-surface border-surfaceBorder"
                }`}
              >
                <Text
                  className={`w-12 text-sm font-black ${
                    set.completed ? "text-primary" : "text-textSecondary"
                  }`}
                >
                  #{set.setNumber}
                </Text>

                <TextInput
                  value={set.weight}
                  onChangeText={(val) => handleUpdateSetWeight(set.id, val)}
                  keyboardType="numeric"
                  placeholder="kg"
                  placeholderTextColor="#6B6B78"
                  className="flex-1 text-center text-base font-bold font-mono text-textPrimary bg-surfaceHover py-1 rounded-lg border border-surfaceBorder mx-1"
                />

                <TextInput
                  value={set.reps}
                  onChangeText={(val) => handleUpdateSetReps(set.id, val)}
                  keyboardType="numeric"
                  placeholder="rep"
                  placeholderTextColor="#6B6B78"
                  className="flex-1 text-center text-base font-bold font-mono text-textPrimary bg-surfaceHover py-1 rounded-lg border border-surfaceBorder mx-1"
                />

                <Pressable
                  onPress={() => handleToggleSet(set.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  className="w-16 items-end"
                >
                  <View
                    className={`h-8 w-8 rounded-lg items-center justify-center ${
                      set.completed ? "bg-primary" : "bg-surfaceHover border border-surfaceBorder"
                    }`}
                  >
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={set.completed ? "#000" : "#6B6B78"}
                    />
                  </View>
                </Pressable>
              </View>
            ))}
          </View>

          {/* Add Set Button */}
          <Pressable
            onPress={handleAddSet}
            className="mt-3 py-2.5 items-center justify-center rounded-xl bg-surfaceHover border border-surfaceBorder flex-row"
          >
            <Ionicons name="add" size={16} color="#CCFF00" />
            <Text className="ml-1 text-xs font-bold text-primary">
              {language === "tr" ? "+ SET EKLE" : "+ ADD SET"}
            </Text>
          </Pressable>
        </View>

        {/* Pagination between exercises */}
        <View className="flex-row gap-3 mt-4 mb-8">
          {activeExerciseIndex > 0 && (
            <Button
              title={t("prevExercise")}
              variant="secondary"
              className="flex-1"
              onPress={() => setActiveExerciseIndex((i) => i - 1)}
            />
          )}
          {activeExerciseIndex < exercises.length - 1 && (
            <Button
              title={t("nextExercise")}
              variant="primary"
              className="flex-1"
              onPress={() => setActiveExerciseIndex((i) => i + 1)}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
