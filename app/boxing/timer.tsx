import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

type TimerPhase = "prep" | "work" | "rest" | "finished";

export default function BoxingTimerScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  const [totalRounds, setTotalRounds] = useState<number>(6);
  const [workDuration, setWorkDuration] = useState<number>(180); // 3 mins
  const [restDuration, setRestDuration] = useState<number>(60); // 1 min
  const [prepDuration, setPrepDuration] = useState<number>(10); // 10 secs

  const [currentRound, setCurrentRound] = useState<number>(1);
  const [phase, setPhase] = useState<TimerPhase>("prep");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10);
  const [isActive, setIsActive] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (timerRef.current) clearInterval(timerRef.current);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/boxing");
    }
  };

  const triggerTransitionHaptics = (newPhase: TimerPhase) => {
    if (newPhase === "work") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (newPhase === "rest") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else if (newPhase === "finished") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (phase === "prep") {
            setPhase("work");
            triggerTransitionHaptics("work");
            return workDuration;
          } else if (phase === "work") {
            if (currentRound >= totalRounds) {
              setPhase("finished");
              setIsActive(false);
              triggerTransitionHaptics("finished");
              return 0;
            } else {
              setPhase("rest");
              triggerTransitionHaptics("rest");
              return restDuration;
            }
          } else if (phase === "rest") {
            setCurrentRound((r) => r + 1);
            setPhase("work");
            triggerTransitionHaptics("work");
            return workDuration;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, currentRound, totalRounds, workDuration, restDuration]);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsActive(!isActive);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsActive(false);
    setPhase("prep");
    setCurrentRound(1);
    setSecondsRemaining(prepDuration);
  };

  const formatTime = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  const phaseColors: Record<TimerPhase, { bg: string; text: string; label: string }> = {
    prep: { bg: "bg-surfaceHover", text: "text-gold", label: t("prepPhase") },
    work: { bg: "bg-primary/20", text: "text-primary", label: t("workPhase") },
    rest: { bg: "bg-blue-900/30", text: "text-blue-400", label: t("restPhase") },
    finished: { bg: "bg-surfaceHover", text: "text-success", label: t("finishedPhase") },
  };

  const currentPhaseStyle = phaseColors[phase];

  return (
    <View
      className="flex-1 bg-background px-5 justify-between"
      style={{
        paddingTop: Math.max(insets.top, 24) + 8,
        paddingBottom: Math.max(insets.bottom, 20) + 12,
      }}
    >
      {/* Top Bar with guaranteed safe clearance and large hitSlop */}
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={handleClose}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          className="h-11 w-11 items-center justify-center rounded-full bg-surface border border-surfaceBorder active:opacity-75"
        >
          <Ionicons name="close" size={22} color="#F4F4F6" />
        </Pressable>
        <View className="items-center">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-textSecondary">
            {t("boxingSubtitle")}
          </Text>
          <Text className="text-base font-black text-textPrimary">
            {t("boxingTimerHeader")}
          </Text>
        </View>
        <View className="w-11" />
      </View>

      {/* Main Display */}
      <View className="items-center my-auto">
        <View className={`px-4 py-1.5 rounded-full mb-6 border border-surfaceBorder ${currentPhaseStyle.bg}`}>
          <Text className={`text-xs font-black tracking-widest uppercase ${currentPhaseStyle.text}`}>
            {currentPhaseStyle.label}
          </Text>
        </View>

        <Text className="text-7xl sm:text-8xl font-black font-mono tracking-tighter text-textPrimary my-4 text-center">
          {formatTime(secondsRemaining)}
        </Text>

        <View className="flex-row items-center gap-2 mt-4 bg-surface px-5 py-2.5 rounded-2xl border border-surfaceBorder">
          <Ionicons name="flame" size={16} color="#CCFF00" />
          <Text className="text-sm font-bold text-textPrimary tracking-wide">
            {t("roundOf")} <Text className="text-primary font-black text-lg">{currentRound}</Text> / {totalRounds}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View className="gap-3">
        <Button
          title={
            isActive
              ? t("pauseRound")
              : phase === "finished"
              ? t("restartRound")
              : t("startRound")
          }
          onPress={phase === "finished" ? handleReset : handleToggle}
          size="lg"
          variant={isActive ? "secondary" : "primary"}
          icon={
            <Ionicons
              name={isActive ? "pause" : "play"}
              size={20}
              color={isActive ? "#FFF" : "#000"}
            />
          }
        />
        <Button
          title={t("resetTimer")}
          variant="ghost"
          onPress={handleReset}
          size="md"
        />
      </View>
    </View>
  );
}
