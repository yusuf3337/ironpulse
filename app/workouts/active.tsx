import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();

  const [exercises, setExercises] = useState<WorkoutExercise[]>([
    {
      id: "ex-1",
      name: "Barbell Bench Press",
      category: "Göğüs",
      previousBest: "115 kg × 6 tekrar",
      sets: [
        { id: "s-1", setNumber: 1, weight: "100", reps: "8", completed: true },
        { id: "s-2", setNumber: 2, weight: "105", reps: "8", completed: false },
        { id: "s-3", setNumber: 3, weight: "110", reps: "6", completed: false },
      ],
    },
    {
      id: "ex-2",
      name: "Incline Dumbbell Press",
      category: "Üst Göğüs",
      previousBest: "36 kg × 8 tekrar",
      sets: [
        { id: "s-4", setNumber: 1, weight: "34", reps: "10", completed: false },
        { id: "s-5", setNumber: 2, weight: "36", reps: "8", completed: false },
      ],
    },
  ]);

  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const currentExercise = exercises[activeExerciseIndex];

  const handleClose = () => {
    Alert.alert(
      t("activeSession"),
      "Mevcut antrenmandan çıkmak istediğinize emin misiniz?",
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("close"),
          style: "destructive",
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)/train");
            }
          },
        },
      ]
    );
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

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(t("finish"), t("workoutFinishedAlert"), [
      {
        text: "Tamam",
        onPress: () => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/(tabs)/train");
          }
        },
      },
    ]);
  };

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
        <View className="items-center">
          <Text className="text-[10px] font-bold text-primary uppercase tracking-widest">
            {t("activeSession")}
          </Text>
          <Text className="text-sm font-black text-textPrimary">
            Üst Vücut Güç (Upper Body)
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

        {/* Set Logger Table */}
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
              <Pressable
                key={set.id}
                onPress={() => handleToggleSet(set.id)}
                className={`flex-row items-center p-3 rounded-xl border ${
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
                <Text className="flex-1 text-center text-base font-bold font-mono text-textPrimary">
                  {set.weight}
                </Text>
                <Text className="flex-1 text-center text-base font-bold font-mono text-textPrimary">
                  {set.reps}
                </Text>
                <View className="w-16 items-end">
                  <View
                    className={`h-7 w-7 rounded-lg items-center justify-center ${
                      set.completed ? "bg-primary" : "bg-surfaceHover border border-surfaceBorder"
                    }`}
                  >
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={set.completed ? "#000" : "#6B6B78"}
                    />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Pagination between exercises */}
        <View className="flex-row gap-3 mt-4">
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
