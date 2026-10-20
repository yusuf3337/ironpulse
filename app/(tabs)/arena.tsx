import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useDatabase } from "@/db/useDatabase";
import { PersonalRecord } from "@/db/schema";
import { useLanguage } from "@/context/LanguageContext";

export default function ArenaScreen(): React.JSX.Element {
  const { prs: prRepo } = useDatabase();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"records" | "achievements">("records");
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [rankInfo, setRankInfo] = useState<{
    rank: string;
    tier: number;
    progressPercent: number;
    description: string;
  }>({
    rank: "BRONZE",
    tier: 1,
    progressPercent: 35,
    description: language === "tr" ? "Temel antrenman disiplini ve ilk rekorlar." : "Initial foundational training and base records.",
  });

  useEffect(() => {
    loadArenaData();
  }, [language]);

  const loadArenaData = async () => {
    try {
      const allPRs = await prRepo.getAllPRs();
      setRecords(allPRs);
      const tier = await prRepo.getAthleteTierRank();
      setRankInfo(tier);
    } catch (err) {
      console.error("Failed to load arena data", err);
    }
  };

  const rankNamesTr: Record<string, string> = {
    BRONZE: "BRONZ",
    SILVER: "GÜMÜŞ",
    GOLD: "ALTIN",
    PLATINUM: "PLATİN",
    DIAMOND: "ELMAS",
    CHALLENGER: "MEYDAN OKUYAN",
  };

  const displayedRank = language === "tr" ? rankNamesTr[rankInfo.rank] ?? rankInfo.rank : rankInfo.rank;

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <View className="mb-4 pt-1">
        <Text className="text-[11px] font-bold uppercase tracking-widest text-gold">
          {t("arenaSubtitle")}
        </Text>
        <Text className="text-3xl font-black tracking-tight text-textPrimary">
          {t("arenaTitle")}
        </Text>
      </View>

      {/* Rank Status Banner */}
      <Card variant="goldHighlight" className="p-4 sm:p-5 mb-5">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Ionicons name="shield-checkmark" size={18} color="#E5A93C" />
            <Text className="ml-2 text-xs font-black uppercase tracking-widest text-gold">
              {t("athleteTierRank")}
            </Text>
          </View>
          <View className="rounded-full bg-gold/20 px-2.5 py-0.5">
            <Text className="text-[10px] font-extrabold text-gold uppercase">
              {t("tierRank")} {rankInfo.tier} / 6
            </Text>
          </View>
        </View>

        <Text className="text-3xl font-black text-textPrimary">
          {displayedRank}
        </Text>
        <Text className="text-xs text-textSecondary mt-1 mb-3.5 leading-relaxed">
          {rankInfo.description}
        </Text>

        <View className="bg-surfaceHover rounded-full h-2 w-full overflow-hidden mb-1.5">
          <View
            className="bg-gold h-full"
            style={{ width: `${Math.min(100, Math.max(5, rankInfo.progressPercent))}%` }}
          />
        </View>
        <Text className="text-[10px] font-bold text-textMuted uppercase text-right">
          %{rankInfo.progressPercent} {t("toNextTier")}
        </Text>
      </Card>

      {/* Toggle View */}
      <View className="flex-row rounded-xl bg-surface border border-surfaceBorder p-1 mb-5">
        <Pressable
          onPress={() => setActiveTab("records")}
          className={`flex-1 py-2 items-center justify-center rounded-lg ${
            activeTab === "records" ? "bg-gold" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-xs font-bold uppercase tracking-wider ${
              activeTab === "records" ? "text-black" : "text-textSecondary"
            }`}
          >
            {t("prsTab")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("achievements")}
          className={`flex-1 py-2 items-center justify-center rounded-lg ${
            activeTab === "achievements" ? "bg-gold" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-xs font-bold uppercase tracking-wider ${
              activeTab === "achievements" ? "text-black" : "text-textSecondary"
            }`}
          >
            {t("achievementsTab")}
          </Text>
        </Pressable>
      </View>

      {activeTab === "records" ? (
        <View>
          <SectionHeader
            title={t("coreLiftsBests")}
            subtitle={t("coreLiftsSub")}
            actionLabel={t("logPr")}
            onAction={() => {
              Alert.alert(
                t("logPr"),
                language === "tr"
                  ? "Yeni bir rekor kaydetmek için antrenman yapıp seti tamamlayın veya manuel değer girin."
                  : "Complete a workout set exceeding your previous best or enter manual record."
              );
            }}
          />
          <View className="gap-2.5">
            {records.map((pr) => {
              const estimated1RM = prRepo.calculateEstimated1RM(pr.weight, pr.reps);
              return (
                <Card key={pr.id} className="p-3.5">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-2">
                      <Text className="text-sm font-black text-textPrimary">
                        {pr.exerciseName}
                      </Text>
                      <Text className="text-xs text-textSecondary mt-0.5">
                        {new Date(pr.achievedAt).toLocaleDateString(language === "tr" ? "tr-TR" : "en-US")} • {pr.notes || (language === "tr" ? "Resmi PR" : "Official PR")}
                      </Text>
                    </View>
                    <View className="items-end">
                      <View className="flex-row items-baseline">
                        <Text className="text-2xl font-black text-gold">
                          {pr.weight}
                        </Text>
                        <Text className="ml-1 text-xs font-bold text-goldMuted uppercase">
                          {pr.unit}
                        </Text>
                      </View>
                      <Text className="text-[11px] font-semibold text-textMuted">
                        {pr.reps} {language === "tr" ? "tekrar" : pr.reps === 1 ? "rep" : "reps"}
                      </Text>
                    </View>
                  </View>

                  <View className="border-t border-surfaceBorder/80 pt-2 flex-row justify-between items-center">
                    <Text className="text-[10px] font-bold text-textSecondary uppercase">
                      {t("estimated1RM")}
                    </Text>
                    <Text className="text-xs font-mono font-bold text-primary">
                      ~{estimated1RM} {pr.unit}
                    </Text>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>
      ) : (
        <View className="gap-2.5">
          <SectionHeader
            title={t("milestonesTitle")}
            subtitle={t("milestonesSub")}
          />
          {[
            {
              title: language === "tr" ? "İlk Antrenman" : "Iron Pioneer",
              desc: language === "tr" ? "İlk antrenman başarıyla tamamlandı" : "First workout logged and completed",
              date: language === "tr" ? "Açıldı" : "Unlocked",
              icon: "flash",
            },
            {
              title: language === "tr" ? "100+ kg Squat Kulübü" : "Century Club",
              desc: language === "tr" ? "100 kg ve üzeri ile squat tekrarı yapıldı" : "Squatted 100+ kg for repetitions",
              date: language === "tr" ? "Açıldı" : "Unlocked",
              icon: "barbell",
            },
            {
              title: language === "tr" ? "12 Raunt Şampiyonu" : "12 Rounds Deep",
              desc: language === "tr" ? "Tek bir boks seansında 12 raunt tamamlandı" : "Completed 12 rounds in a single boxing session",
              date: language === "tr" ? "Açıldı" : "Unlocked",
              icon: "flame",
            },
            {
              title: language === "tr" ? "İstikrar Şövalyesi" : "Consistency Titan",
              desc: language === "tr" ? "4 hafta boyunca aksatmadan antrenman yap" : "Maintained a 4-week unbroken workout streak",
              date: language === "tr" ? "Devam Ediyor (3/4 hft)" : "In Progress (3/4 wks)",
              icon: "trending-up",
            },
          ].map((item, idx) => (
            <Card key={idx} className="p-3.5 flex-row items-center">
              <View className="h-10 w-10 rounded-xl bg-surfaceHover border border-gold/40 items-center justify-center mr-3">
                <Ionicons name={item.icon as any} size={18} color="#E5A93C" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-textPrimary">{item.title}</Text>
                <Text className="text-xs text-textSecondary mt-0.5 leading-relaxed">{item.desc}</Text>
                <Text className="text-[10px] font-mono text-goldMuted mt-1">{item.date}</Text>
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
