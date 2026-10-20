import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { useDatabase } from "@/db/useDatabase";

type TimerPhase = "prep" | "work" | "rest" | "finished";

export default function BoxingTimerScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const { boxing: boxingRepo } = useDatabase();
  const params = useLocalSearchParams<{
    rounds?: string;
    work?: string;
    rest?: string;
    prep?: string;
    title?: string;
  }>();

  const initialRounds = params.rounds ? parseInt(params.rounds, 10) : 6;
  const initialWork = params.work ? parseInt(params.work, 10) : 180;
  const initialRest = params.rest ? parseInt(params.rest, 10) : 60;
  const initialPrep = params.prep ? parseInt(params.prep, 10) : 10;
  const timerTitle = params.title || (language === "tr" ? "Boks Raunt Sayacı" : "Boxing Round Timer");

  const [totalRounds, setTotalRounds] = useState<number>(initialRounds);
  const [workDuration, setWorkDuration] = useState<number>(initialWork);
  const [restDuration, setRestDuration] = useState<number>(initialRest);
  const [prepDuration, setPrepDuration] = useState<number>(initialPrep);

  const [currentRound, setCurrentRound] = useState<number>(1);
  const [phase, setPhase] = useState<TimerPhase>("prep");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialPrep);
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

              // Save completed session to SQLite
              const now = new Date().toISOString();
              boxingRepo.saveSession({
                presetName: timerTitle,
                completedRounds: totalRounds,
                totalRounds,
                workSeconds: workDuration,
                restSeconds: restDuration,
                startedAt: now,
                completedAt: now,
                notes: "Boks seansı tamamlandı",
              }).catch(console.error);

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
  }, [isActive, phase, currentRound, totalRounds, workDuration, restDuration, timerTitle]);

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
      {/* Top Bar with safe area clearance */}
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={handleClose}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          className="h-11 w-11 items-center justify-center rounded-full bg-surface border border-surfaceBorder active:opacity-75"
        >
          <Ionicons name="close" size={22} color="#F4F4F6" />
        </Pressable>
        <View className="items-center flex-1 mx-2">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-textSecondary" numberOfLines={1}>
            {timerTitle}
          </Text>
          <Text className="text-base font-black text-textPrimary">
            {formatTime(workDuration)} {language === "tr" ? "Çalışma" : "Work"} • {restDuration}s {language === "tr" ? "Dinlenme" : "Rest"}
          </Text>
        </View>
        <Pressable
          onPress={handleReset}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          className="h-11 w-11 items-center justify-center rounded-full bg-surface border border-surfaceBorder active:opacity-75"
        >
          <Ionicons name="refresh" size={18} color="#CCFF00" />
        </Pressable>
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
