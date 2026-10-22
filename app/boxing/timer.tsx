import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { useDatabase } from "@/db/useDatabase";

type TimerPhase = "prep" | "work" | "rest" | "finished";

const bellSingleSource = require("@/assets/sounds/bell_single.wav");
const bellDoubleSource = require("@/assets/sounds/bell_double.wav");
const bellTripleSource = require("@/assets/sounds/bell_triple.wav");
const clapperSource = require("@/assets/sounds/clapper.wav");

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

  // Audio Players for authentic boxing ring sounds
  const singleBellPlayer = useAudioPlayer(bellSingleSource);
  const doubleBellPlayer = useAudioPlayer(bellDoubleSource);
  const tripleBellPlayer = useAudioPlayer(bellTripleSource);
  const clapperPlayer = useAudioPlayer(clapperSource);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

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

  useEffect(() => {
    // Configure audio mode for background and silent mode playback
    setAudioModeAsync({
      playsInSilentMode: true,
    }).catch(console.error);
  }, []);

  const playBellSound = (type: "start" | "rest" | "finished" | "warning") => {
    if (!soundEnabled) return;
    try {
      if (type === "start") {
        singleBellPlayer.seekTo(0);
        singleBellPlayer.play();
      } else if (type === "rest") {
        doubleBellPlayer.seekTo(0);
        doubleBellPlayer.play();
      } else if (type === "finished") {
        tripleBellPlayer.seekTo(0);
        tripleBellPlayer.play();
      } else if (type === "warning") {
        clapperPlayer.seekTo(0);
        clapperPlayer.play();
      }
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

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
        // 10 second warning clapper
        if (prev === 11 && phase === "work") {
          playBellSound("warning");
        }

        if (prev <= 1) {
          if (phase === "prep") {
            setPhase("work");
            triggerTransitionHaptics("work");
            playBellSound("start");
            return workDuration;
          } else if (phase === "work") {
            if (currentRound >= totalRounds) {
              setPhase("finished");
              setIsActive(false);
              triggerTransitionHaptics("finished");
              playBellSound("finished");

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
              playBellSound("rest");
              return restDuration;
            }
          } else if (phase === "rest") {
            setCurrentRound((r) => r + 1);
            setPhase("work");
            triggerTransitionHaptics("work");
            playBellSound("start");
            return workDuration;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, currentRound, totalRounds, workDuration, restDuration, timerTitle, soundEnabled]);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isActive && phase === "prep" && secondsRemaining === prepDuration) {
      // First start chime
      playBellSound("warning");
    }
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

  const phaseColors: Record<
    TimerPhase,
    { bg: string; border: string; text: string; label: string; icon: keyof typeof Ionicons.glyphMap }
  > = {
    prep: {
      bg: "bg-amber-500/15",
      border: "border-amber-500/40",
      text: "text-amber-400",
      label: language === "tr" ? "HAZIRLANIN" : "GET READY",
      icon: "notifications",
    },
    work: {
      bg: "bg-crimson/20",
      border: "border-crimson/50",
      text: "text-crimson",
      label: language === "tr" ? "DÖVÜŞ (RAUNT AÇIK)" : "FIGHT - ROUND ACTIVE",
      icon: "flame",
    },
    rest: {
      bg: "bg-sky-500/15",
      border: "border-sky-500/40",
      text: "text-sky-400",
      label: language === "tr" ? "DİNLENME & NEFESLEN" : "REST & BREATHE",
      icon: "water",
    },
    finished: {
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/40",
      text: "text-emerald-400",
      label: language === "tr" ? "RAUNTLAR TAMAMLANDI" : "SESSION COMPLETE",
      icon: "trophy",
    },
  };

  const currentPhaseStyle = phaseColors[phase];

  return (
    <View
      className="flex-1 bg-[#0B0B0E] px-5 justify-between"
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
          <Text
            className="text-[10px] font-black uppercase tracking-widest text-textSecondary"
            numberOfLines={1}
          >
            {timerTitle}
          </Text>
          <Text className="text-sm sm:text-base font-black text-textPrimary">
            {formatTime(workDuration)} {language === "tr" ? "Çalışma" : "Work"} • {restDuration}s{" "}
            {language === "tr" ? "Dinlenme" : "Rest"}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSoundEnabled(!soundEnabled);
            }}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            className={`h-11 w-11 items-center justify-center rounded-full border active:opacity-75 ${
              soundEnabled
                ? "bg-crimson/15 border-crimson/40"
                : "bg-surface border-surfaceBorder"
            }`}
          >
            <Ionicons
              name={soundEnabled ? "volume-high" : "volume-mute"}
              size={18}
              color={soundEnabled ? "#D81E3C" : "#6B6B78"}
            />
          </Pressable>

          <Pressable
            onPress={handleReset}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            className="h-11 w-11 items-center justify-center rounded-full bg-surface border border-surfaceBorder active:opacity-75"
          >
            <Ionicons name="refresh" size={18} color="#F4F4F6" />
          </Pressable>
        </View>
      </View>

      {/* Main Display (Jabb-Style Central Showcase) */}
      <View className="items-center my-auto">
        {/* Phase Pill Badge */}
        <View
          className={`flex-row items-center gap-1.5 px-4 py-1.5 rounded-full mb-4 border ${currentPhaseStyle.bg} ${currentPhaseStyle.border}`}
        >
          <Ionicons name={currentPhaseStyle.icon} size={14} color={phase === "work" ? "#D81E3C" : "#38BDF8"} />
          <Text className={`text-xs font-black tracking-widest uppercase ${currentPhaseStyle.text}`}>
            {currentPhaseStyle.label}
          </Text>
        </View>

        {/* Big Bold Timer */}
        <Text className="text-8xl sm:text-9xl font-black font-mono tracking-tighter text-textPrimary my-2 text-center">
          {formatTime(secondsRemaining)}
        </Text>

        {/* Round Counter Badge */}
        <View className="flex-row items-center gap-2 mt-2 bg-[#16161C] px-5 py-2.5 rounded-2xl border border-surfaceBorder">
          <Text className="text-sm font-bold text-textSecondary uppercase tracking-wider">
            {language === "tr" ? "RAUNT" : "ROUND"}
          </Text>
          <Text className="text-xl font-black text-white font-mono">
            {currentRound} <Text className="text-textMuted text-sm font-bold">/ {totalRounds}</Text>
          </Text>
        </View>

        {/* Round Progress Dots */}
        <View className="flex-row items-center gap-1.5 mt-4 max-w-[280px] flex-wrap justify-center">
          {Array.from({ length: totalRounds }).map((_, idx) => {
            const isCompleted = idx + 1 < currentRound || phase === "finished";
            const isCurrent = idx + 1 === currentRound && phase !== "finished";

            return (
              <View
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  isCurrent
                    ? "w-6 bg-crimson"
                    : isCompleted
                    ? "w-2 bg-crimson/50"
                    : "w-2 bg-surfaceBorder"
                }`}
              />
            );
          })}
        </View>

        {/* Live Coach Reminder */}
        <Text className="text-xs font-medium text-textMuted mt-5 italic">
          {phase === "work"
            ? language === "tr"
              ? "“Çeneyi koru, vuruş serisini tamamla!”"
              : "“Guard up, finish your punch string!”"
            : phase === "rest"
            ? language === "tr"
              ? "“Burnundan derin nefes al, nabzı düşür.”"
              : "“Deep breath through nose, slow your pulse.”"
            : language === "tr"
            ? "“Harika iş çıkardın, dövüş tamamlandı!”"
            : "“Great work, fight complete!”"}
        </Text>
      </View>

      {/* Controls */}
      <View className="gap-3">
        <Pressable
          onPress={phase === "finished" ? handleReset : handleToggle}
          className={`h-15 rounded-2xl items-center justify-center flex-row gap-2.5 ${
            isActive
              ? "bg-[#1E1E26] border border-surfaceBorder"
              : "bg-crimson active:bg-crimsonDark"
          }`}
        >
          <Ionicons
            name={isActive ? "pause" : "play"}
            size={22}
            color={isActive ? "#FFFFFF" : "#FFFFFF"}
          />
          <Text className="text-base font-black tracking-wide text-white uppercase">
            {isActive
              ? language === "tr"
                ? "DURAKLAT"
                : "PAUSE ROUND"
              : phase === "finished"
              ? language === "tr"
                ? "TEKRAR BAŞLAT"
                : "RESTART SESSION"
              : language === "tr"
              ? "RAUNDA BAŞLA"
              : "START ROUND"}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleReset}
          className="h-11 items-center justify-center active:opacity-75"
        >
          <Text className="text-xs font-bold uppercase tracking-wider text-textSecondary">
            {language === "tr" ? "Sayacı Sıfırla" : "Reset Timer"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
