import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useLanguage } from "@/context/LanguageContext";
import { useDatabase } from "@/db/useDatabase";
import { AthleteSetupModal } from "@/components/profile/AthleteSetupModal";
import { AthleteProfile } from "@/db/schema";

export default function HomeScreen(): React.JSX.Element {
  const { t, language } = useLanguage();
  const { profile: profileRepo, workouts: workoutRepo, boxing: boxingRepo, prs: prRepo } = useDatabase();

  const [athlete, setAthlete] = useState<AthleteProfile | null>(null);
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

  // Real stats from SQLite
  const [weeklySessions, setWeeklySessions] = useState<number>(0);
  const [weeklyBoxingRounds, setWeeklyBoxingRounds] = useState<number>(0);
  const [prCount, setPrCount] = useState<number>(0);

  const loadData = async () => {
    try {
      const isConfigured = await profileRepo.isProfileConfigured();
      if (!isConfigured) {
        setShowSetupModal(true);
      }
      const p = await profileRepo.getProfile();
      setAthlete(p);

      const sess = await workoutRepo.getSessionsCountThisWeek();
      setWeeklySessions(sess);

      const rounds = await boxingRepo.getRoundsCompletedThisWeek();
      setWeeklyBoxingRounds(rounds);

      const allPrs = await prRepo.getAllPRs();
      setPrCount(allPrs.length);
    } catch (err) {
      console.error("Home load error:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const todayName = new Date().toLocaleDateString(
    language === "tr" ? "tr-TR" : "en-US",
    {
      weekday: "long",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <ScreenContainer scrollable>
      {/* Athlete Onboarding Modal (appears on first run if profile is empty) */}
      <AthleteSetupModal
        visible={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSaved={loadData}
        initialProfile={athlete}
        isFirstTime={!athlete || !athlete.height}
      />

      {/* Top Header */}
      <View className="flex-row items-center justify-between mb-5 pt-1">
        <View className="flex-1 mr-2">
          <Text className="text-[11px] font-bold uppercase tracking-widest text-primary">
            {todayName}
          </Text>
          <Text className="text-3xl font-black tracking-tighter text-textPrimary">
            IRON<Text className="text-primary">PULSE</Text>
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)/profile")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface border border-surfaceBorder active:opacity-80"
        >
          <Ionicons name="person" size={18} color="#CCFF00" />
        </Pressable>
      </View>

      {/* Hero: Next Scheduled Workout */}
      <Card variant="highlight" className="mb-5 p-4 sm:p-5">
        <View className="flex-row items-center justify-between mb-2.5">
          <View className="rounded-md bg-primary/20 px-2 py-0.5">
            <Text className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
              {t("todaySplit")}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#9E9EA8" />
            <Text className="ml-1 text-xs text-textSecondary font-semibold">
              ~50 dk
            </Text>
          </View>
        </View>

        <Text className="text-2xl font-black text-textPrimary tracking-tight">
          {language === "tr" ? "Üst Vücut Güç" : "Upper Body Power"}
        </Text>
        <Text className="mt-1 text-xs text-textSecondary leading-relaxed">
          Bench Press • Barbell Row • Overhead Press • Pull-ups
        </Text>

        <View className="mt-4 flex-col sm:flex-row gap-2.5">
          <Button
            title={t("startWorkout")}
            onPress={() => router.push("/workouts/active")}
            className="flex-1"
            icon={<Ionicons name="play" size={16} color="#000" />}
          />
          <Button
            title={t("boxingTimer")}
            variant="secondary"
            onPress={() => router.push("/boxing/timer")}
            className="flex-1"
            icon={<Ionicons name="stopwatch" size={16} color="#CCFF00" />}
          />
        </View>
      </Card>

      {/* Weekly Stats Row (Real SQLite counts, start at 0) */}
      <SectionHeader
        title={t("weeklyPerformance")}
        subtitle={t("weeklySubtitle")}
      />
      <View className="flex-row gap-2 sm:gap-3 mb-5">
        <StatCard
          label={t("sessionsStat")}
          value={weeklySessions}
          unit={t("thisWk")}
          highlight={weeklySessions > 0}
          icon={<Ionicons name="barbell" size={15} color="#CCFF00" />}
        />
        <StatCard
          label={t("boxingStat")}
          value={weeklyBoxingRounds}
          unit={t("roundsUnit")}
          highlight={weeklyBoxingRounds > 0}
          icon={<Ionicons name="flame" size={15} color="#9E9EA8" />}
        />
        <StatCard
          label={t("prStat")}
          value={prCount}
          unit={t("recordsUnit")}
          gold
          icon={<Ionicons name="trophy" size={15} color="#E5A93C" />}
        />
      </View>

      {/* Quick Launchpad */}
      <SectionHeader title={t("quickLaunch")} />
      <View className="gap-2.5 mb-6">
        <Card
          onPress={() => router.push("/boxing/timer")}
          className="flex-row items-center justify-between p-3.5"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-surfaceHover border border-surfaceBorder mr-3">
              <Ionicons name="timer-outline" size={20} color="#CCFF00" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-textPrimary">
                {t("boxingTimerTitle")}
              </Text>
              <Text numberOfLines={1} className="text-xs text-textSecondary">
                {t("boxingTimerSub")}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B6B78" />
        </Card>

        <Card
          onPress={() => router.push("/(tabs)/arena")}
          className="flex-row items-center justify-between p-3.5"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-surfaceHover border border-surfaceBorder mr-3">
              <Ionicons name="trophy-outline" size={20} color="#E5A93C" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-textPrimary">
                {t("prArenaTitle")}
              </Text>
              <Text numberOfLines={1} className="text-xs text-textSecondary">
                {t("prArenaSub")}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B6B78" />
        </Card>

        <Card
          onPress={() => router.push("/(tabs)/train")}
          className="flex-row items-center justify-between p-3.5"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-surfaceHover border border-surfaceBorder mr-3">
              <Ionicons name="calendar-outline" size={20} color="#9E9EA8" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-textPrimary">
                {t("weeklyPlannerTitle")}
              </Text>
              <Text numberOfLines={1} className="text-xs text-textSecondary">
                {t("weeklyPlannerSub")}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B6B78" />
        </Card>
      </View>
    </ScreenContainer>
  );
}
