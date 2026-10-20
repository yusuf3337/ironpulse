import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
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
    progressPercent: 0,
    description: language === "tr" ? "Temel antrenman disiplini ve ilk rekorlar." : "Initial foundational training and base records.",
  });

  // Manual PR Modal State
  const [showAddPrModal, setShowAddPrModal] = useState<boolean>(false);
  const [prExercise, setPrExercise] = useState<string>("Barbell Bench Press");
  const [prWeight, setPrWeight] = useState<string>("");
  const [prReps, setPrReps] = useState<string>("1");
  const [prNotes, setPrNotes] = useState<string>("");

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

  useFocusEffect(
    useCallback(() => {
      loadArenaData();
    }, [language])
  );

  const handleSavePr = async () => {
    const weightNum = parseFloat(prWeight);
    const repsNum = parseInt(prReps, 10);

    if (!weightNum || weightNum <= 0) {
      Alert.alert(
        language === "tr" ? "Geçersiz Ağırlık" : "Invalid Weight",
        language === "tr" ? "Lütfen geçerli bir ağırlık girin." : "Please enter a valid weight."
      );
      return;
    }

    if (!repsNum || repsNum <= 0) {
      Alert.alert(
        language === "tr" ? "Geçersiz Tekrar" : "Invalid Reps",
        language === "tr" ? "Tekrar sayısı en az 1 olmalıdır." : "Reps must be at least 1."
      );
      return;
    }

    try {
      await prRepo.checkAndSavePR(
        `ex-${Date.now()}`,
        prExercise.trim(),
        weightNum,
        repsNum,
        "kg"
      );
      setShowAddPrModal(false);
      setPrWeight("");
      setPrReps("1");
      setPrNotes("");
      loadArenaData();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save PR");
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
      {/* Manual PR Add Modal */}
      <Modal
        visible={showAddPrModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddPrModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end bg-black/80"
        >
          <View className="rounded-t-3xl border-t border-surfaceBorder bg-background p-5 pb-9">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-[10px] font-black uppercase tracking-widest text-gold">
                  {language === "tr" ? "KİŞİSEL REKOR" : "PERSONAL RECORD"}
                </Text>
                <Text className="text-xl font-black text-textPrimary">
                  {language === "tr" ? "Yeni Rekor Ekle" : "Add Personal Record"}
                </Text>
              </View>
              <Pressable
                onPress={() => setShowAddPrModal(false)}
                className="h-9 w-9 items-center justify-center rounded-full bg-surface border border-surfaceBorder"
              >
                <Ionicons name="close" size={18} color="#F4F4F6" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-3">
                <Text className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mb-1.5">
                  {language === "tr" ? "Egzersiz Adı" : "Exercise Name"}
                </Text>
                <TextInput
                  value={prExercise}
                  onChangeText={setPrExercise}
                  placeholder="Barbell Bench Press"
                  placeholderTextColor="#6B6B78"
                  className="h-12 rounded-xl bg-surface border border-surfaceBorder px-4 text-sm font-semibold text-textPrimary"
                />
              </View>

              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mb-1.5">
                    {language === "tr" ? "Ağırlık (kg)" : "Weight (kg)"}
                  </Text>
                  <TextInput
                    value={prWeight}
                    onChangeText={setPrWeight}
                    keyboardType="numeric"
                    placeholder="100"
                    placeholderTextColor="#6B6B78"
                    className="h-12 rounded-xl bg-surface border border-surfaceBorder px-4 text-base font-bold font-mono text-textPrimary"
                  />
                </View>

                <View className="w-28">
                  <Text className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mb-1.5">
                    {language === "tr" ? "Tekrar" : "Reps"}
                  </Text>
                  <TextInput
                    value={prReps}
                    onChangeText={setPrReps}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor="#6B6B78"
                    className="h-12 rounded-xl bg-surface border border-surfaceBorder px-4 text-base font-bold font-mono text-textPrimary"
                  />
                </View>
              </View>

              <Button
                title={language === "tr" ? "REKORU KAYDET" : "SAVE RECORD"}
                variant="gold"
                size="lg"
                onPress={handleSavePr}
                icon={<Ionicons name="trophy" size={18} color="#000" />}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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
            onAction={() => setShowAddPrModal(true)}
          />
          {records.length > 0 ? (
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
          ) : (
            <EmptyState
              icon={<Ionicons name="trophy-outline" size={32} color="#E5A93C" />}
              title={language === "tr" ? "Henüz Kişisel Rekor Yok" : "No Personal Records Yet"}
              description={
                language === "tr"
                  ? "Antrenman yaparak veya '+ PR Ekle' butonuna basarak ilk rekorunuzu kaydedin."
                  : "Complete a workout or tap '+ Log PR' to record your first personal best."
              }
              actionLabel={t("logPr")}
              onAction={() => setShowAddPrModal(true)}
            />
          )}
        </View>
      ) : (
        <View className="gap-2.5">
          <SectionHeader
            title={t("milestonesTitle")}
            subtitle={t("milestonesSub")}
          />
          {[
            {
              title: language === "tr" ? "İlk Adım" : "First Blood",
              desc: language === "tr" ? "İlk antrenman seansınızı tamamlayın" : "Complete your first logged workout session",
              icon: "flash",
            },
            {
              title: language === "tr" ? "100+ kg Squat" : "Century Club",
              desc: language === "tr" ? "Squat hareketinde 100 kg ve üzeri rekor kırın" : "Squatted 100+ kg for repetitions",
              icon: "barbell",
            },
            {
              title: language === "tr" ? "12 Raunt Şampiyonu" : "12 Rounds Deep",
              desc: language === "tr" ? "Tek bir boks seansında 12 raunt tamamlayın" : "Completed 12 rounds in a single boxing session",
              icon: "flame",
            },
            {
              title: language === "tr" ? "Çelik İrade" : "Consistency Titan",
              desc: language === "tr" ? "4 hafta boyunca aksatmadan antrenman yapın" : "Maintain a 4-week unbroken workout streak",
              icon: "trending-up",
            },
          ].map((item, idx) => (
            <Card key={idx} className="p-3.5 flex-row items-center opacity-75">
              <View className="h-10 w-10 rounded-xl bg-surfaceHover border border-surfaceBorder items-center justify-center mr-3">
                <Ionicons name={item.icon as any} size={18} color="#9E9EA8" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-textPrimary">{item.title}</Text>
                <Text className="text-xs text-textSecondary mt-0.5 leading-relaxed">{item.desc}</Text>
              </View>
              <Ionicons name="lock-closed" size={14} color="#6B6B78" />
            </Card>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
