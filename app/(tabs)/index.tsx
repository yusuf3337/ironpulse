import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
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
import { DayRoutine } from "@/db/repositories/programRepo";
import * as Haptics from "expo-haptics";
import { ATHLETE_QUOTES } from "@/constants/athleteQuotes";

export default function HomeScreen(): React.JSX.Element {
  const { t, language } = useLanguage();
  const {
    profile: profileRepo,
    workouts: workoutRepo,
    boxing: boxingRepo,
    prs: prRepo,
    programs: programRepo,
  } = useDatabase();

  const [athlete, setAthlete] = useState<AthleteProfile | null>(null);
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

  // Real stats from SQLite
  const [weeklySessions, setWeeklySessions] = useState<number>(0);
  const [weeklyBoxingRounds, setWeeklyBoxingRounds] = useState<number>(0);
  const [prCount, setPrCount] = useState<number>(0);
  const [tierRank, setTierRank] = useState<{
    rank: string;
    tier: number;
    progressPercent: number;
  }>({ rank: "BRONZE", tier: 1, progressPercent: 0 });

  // Today's actual planned routine from SQLite
  const [todayRoutine, setTodayRoutine] = useState<DayRoutine | null>(null);

  // Athlete Mindset Quotes rotation
  const [quoteIndex, setQuoteIndex] = useState<number>(() =>
    Math.floor(Math.random() * ATHLETE_QUOTES.length)
  );

  const handleNextQuote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuoteIndex((prev) => (prev + 1) % ATHLETE_QUOTES.length);
  };

  const loadData = async () => {
    try {
      const weekdaysKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      const currentDayKey = weekdaysKeys[new Date().getDay()];

      const [isConfigured, p, sess, rounds, allPrs, rank, routine] = await Promise.all([
        profileRepo.isProfileConfigured(),
        profileRepo.getProfile(),
        workoutRepo.getSessionsCountThisWeek(),
        boxingRepo.getRoundsCompletedThisWeek(),
        prRepo.getAllPRs(),
        prRepo.getAthleteTierRank(),
        programRepo.getDayRoutine(currentDayKey),
      ]);

      if (!isConfigured) {
        setShowSetupModal(true);
      }
      setAthlete(p);
      setWeeklySessions(sess);
      setWeeklyBoxingRounds(rounds);
      setPrCount(allPrs.length);
      setTierRank(rank);
      setTodayRoutine(routine);
    } catch (err) {
      console.error("Home load error:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (language === "tr") {
      if (hour < 12) return "Günaydın";
      if (hour < 18) return "İyi Günler";
      return "İyi Akşamlar";
    } else {
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
    }
  };

  const todayFormattedDate = new Date().toLocaleDateString(
    language === "tr" ? "tr-TR" : "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
  );

  const bmi =
    athlete?.currentWeight && athlete?.height
      ? profileRepo.calculateBMI(athlete.currentWeight, athlete.height)
      : null;

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

      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between mb-4 pt-1">
        <View className="flex-1 mr-2">
          <View className="flex-row items-center gap-1.5 mb-0.5">
            <View className="h-2 w-2 rounded-full bg-primary" />
            <Text className="text-[11px] font-bold uppercase tracking-widest text-textSecondary">
              {todayFormattedDate}
            </Text>
          </View>
          <Text className="text-2xl sm:text-3xl font-black tracking-tight text-textPrimary">
            {getGreeting()},{" "}
            <Text className="text-primary font-black">
              {athlete?.displayName || (language === "tr" ? "Sporcu" : "Athlete")}
            </Text>
          </Text>
        </View>

        {/* Profile & Rank Avatar */}
        <Pressable
          onPress={() => router.push("/(tabs)/profile")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="items-center"
        >
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-surface border border-primary/50 active:scale-95 transition-all">
            <Ionicons name="person" size={22} color="#CCFF00" />
          </View>
          <View className="mt-1 rounded bg-primary/20 px-1.5 py-0.2">
            <Text className="text-[8px] font-black tracking-wider text-primary">
              {tierRank.rank}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Hero: Today's Focus & Split Card */}
      {todayRoutine && todayRoutine.isRest ? (
        // Rest Day View
        <Card className="mb-5 p-4 sm:p-5 border-blue-500/30 bg-blue-950/10">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-1.5 rounded-full bg-blue-500/20 px-2.5 py-1">
              <Ionicons name="moon" size={12} color="#38BDF8" />
              <Text className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                {language === "tr" ? "AKTİF TOPARLANMA & DİNLENME" : "RECOVERY & REST DAY"}
              </Text>
            </View>
            <Text className="text-xs text-textSecondary font-semibold">
              {language === "tr" ? "Kas Onarımı" : "Muscle Repair"}
            </Text>
          </View>

          <Text className="text-2xl font-black text-textPrimary tracking-tight">
            {todayRoutine.title || (language === "tr" ? "Dinlenme Günü" : "Rest Day")}
          </Text>
          <Text className="mt-1 text-xs text-textSecondary leading-relaxed">
            {language === "tr"
              ? "Bugün vücudun güç toplama ve kas liflerini onarma günü. Yeterli protein, su ve hafif esneme hareketleri önerilir."
              : "Today is dedicated to muscle fiber repair and central nervous system recovery. Hydrate and stretch lightly."}
          </Text>

          <View className="mt-4 flex-row gap-2.5">
            <Button
              title={language === "tr" ? "Hafif Boks / Gölge Boksu" : "Light Shadowboxing"}
              variant="secondary"
              onPress={() => router.push("/boxing/timer")}
              className="flex-1"
              icon={<Ionicons name="stopwatch-outline" size={16} color="#CCFF00" />}
            />
            <Button
              title={language === "tr" ? "Planı Düzenle" : "Edit Plan"}
              variant="ghost"
              onPress={() => router.push("/(tabs)/train")}
              size="md"
            />
          </View>
        </Card>
      ) : (
        // Workout Day View
        <Card variant="highlight" className="mb-5 p-4 sm:p-5">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-1.5 rounded-full bg-primary/20 px-2.5 py-1">
              <Ionicons name="flame" size={12} color="#CCFF00" />
              <Text className="text-[10px] font-black uppercase tracking-wider text-primary">
                {t("todaySplit")}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={13} color="#9E9EA8" />
              <Text className="ml-1 text-xs text-textSecondary font-semibold">
                ~{todayRoutine?.exercises ? Math.max(35, todayRoutine.exercises.length * 9) : 45} dk
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-black text-textPrimary tracking-tight">
            {todayRoutine?.title || (language === "tr" ? "Üst Vücut Güç" : "Upper Body Power")}
          </Text>

          {/* Exercise Pills Preview */}
          {todayRoutine?.exercises && todayRoutine.exercises.length > 0 ? (
            <View className="flex-row flex-wrap gap-1.5 mt-2 mb-1">
              {todayRoutine.exercises.slice(0, 4).map((ex) => (
                <View
                  key={ex.id}
                  className="rounded-md bg-surfaceHover border border-surfaceBorder px-2 py-0.5"
                >
                  <Text className="text-[10px] font-bold text-textSecondary" numberOfLines={1}>
                    {ex.exerciseName}
                  </Text>
                </View>
              ))}
              {todayRoutine.exercises.length > 4 && (
                <View className="rounded-md bg-surfaceHover border border-surfaceBorder px-2 py-0.5">
                  <Text className="text-[10px] font-black text-primary">
                    +{todayRoutine.exercises.length - 4} {language === "tr" ? "daha" : "more"}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text className="mt-1 text-xs text-textSecondary leading-relaxed">
              {language === "tr"
                ? "Bugün için özel hareket seçmek için Haftalık Program sekmesinden günü düzenleyebilirsiniz."
                : "You can customize today's exercise list in the Weekly Planner tab."}
            </Text>
          )}

          <View className="mt-4 gap-2.5">
            <Button
              title={t("startWorkout") || (language === "tr" ? "ANTRENMANA BAŞLA" : "START WORKOUT")}
              onPress={() => router.push("/workouts/active")}
              size="lg"
              className="w-full"
              icon={<Ionicons name="play" size={18} color="#000" />}
            />
            <Button
              title={language === "tr" ? "Programı İncele" : "View Split"}
              variant="secondary"
              onPress={() => router.navigate("/(tabs)/train")}
              size="lg"
              className="w-full"
              icon={<Ionicons name="calendar-outline" size={16} color="#F4F4F6" />}
            />
          </View>
        </Card>
      )}

      {/* Weekly Stats & Volume Radar (Real SQLite data) */}
      <SectionHeader
        title={t("weeklyPerformance")}
        subtitle={t("weeklySubtitle")}
      />
      <View className="flex-row gap-2 sm:gap-2.5 mb-5">
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

      {/* Boxing Fight Lab Quick Launch Banner */}
      <Card
        onPress={() => router.navigate("/(tabs)/boxing")}
        className="p-4 mb-5 border-primary/30 bg-gradient-to-r from-surface to-surfaceHover"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-2">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 border border-primary/40 mr-3">
              <Ionicons name="timer" size={22} color="#CCFF00" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-sm font-black text-textPrimary">
                  {language === "tr" ? "Boks & Raunt Sayacı" : "Boxing Round Timer"}
                </Text>
                <View className="rounded-full bg-primary/20 px-1.5 py-0.2">
                  <Text className="text-[9px] font-black text-primary">SESLİ ZİL</Text>
                </View>
              </View>
              <Text numberOfLines={1} className="text-xs text-textSecondary mt-0.5">
                {language === "tr"
                  ? "Dövüş zili, dinlenme düdüğü & özel raunt sayaçları"
                  : "Boxing bells, rest horns & custom intervals"}
              </Text>
            </View>
          </View>
          <Button
            title={language === "tr" ? "BAŞLAT" : "START"}
            size="sm"
            onPress={() => router.push("/boxing/timer")}
            icon={<Ionicons name="play" size={12} color="#000" />}
          />
        </View>
      </Card>

      {/* Quick Launchpad Navigation */}
      <SectionHeader title={t("quickLaunch")} />
      <View className="gap-2.5 mb-5">
        <Card
          onPress={() => router.navigate("/(tabs)/arena")}
          className="flex-row items-center justify-between p-3.5 active:bg-surfaceHover"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 mr-3">
              <Ionicons name="trophy" size={20} color="#E5A93C" />
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
          onPress={() => router.navigate("/(tabs)/train")}
          className="flex-row items-center justify-between p-3.5 active:bg-surfaceHover"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-surfaceHover border border-surfaceBorder mr-3">
              <Ionicons name="calendar" size={20} color="#9E9EA8" />
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

      {/* Athlete Mindset Quote Card (Tap to cycle through legends) */}
      <Pressable onPress={handleNextQuote} className="mb-6 active:opacity-90">
        <Card className="p-4 bg-surface border border-surfaceBorder">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-1.5 rounded-full bg-surfaceHover border border-surfaceBorder px-2.5 py-0.5">
              <Text className="text-[10px] font-extrabold uppercase tracking-wider text-textSecondary">
                {ATHLETE_QUOTES[quoteIndex].sport === "Bodybuilding"
                  ? "VÜCUT GELİŞTİRME"
                  : ATHLETE_QUOTES[quoteIndex].sport === "Boxing"
                  ? "BOKS"
                  : "DÖVÜŞ SANATLARI"}{" "}
                • {ATHLETE_QUOTES[quoteIndex].author.toUpperCase()}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="shuffle" size={12} color="#6B6B78" />
              <Text className="text-[10px] font-bold text-textMuted">
                {language === "tr" ? "Dokun ve Değiştir" : "Tap to shuffle"}
              </Text>
            </View>
          </View>

          <Text className="text-sm font-semibold text-textPrimary italic leading-relaxed">
            "{language === "tr"
              ? ATHLETE_QUOTES[quoteIndex].quoteTr
              : ATHLETE_QUOTES[quoteIndex].quoteEn}"
          </Text>

          <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-surfaceBorder/60">
            <Text className="text-xs font-black uppercase text-primary tracking-wider">
              — {ATHLETE_QUOTES[quoteIndex].author}
            </Text>
            <Text className="text-[10px] font-mono text-textMuted">
              {quoteIndex + 1} / {ATHLETE_QUOTES.length}
            </Text>
          </View>
        </Card>
      </Pressable>
    </ScreenContainer>
  );
}
