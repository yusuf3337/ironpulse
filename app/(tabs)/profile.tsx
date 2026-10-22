import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { AthleteSetupModal } from "@/components/profile/AthleteSetupModal";
import { useDatabase } from "@/db/useDatabase";
import { AthleteProfile, BodyMeasurement } from "@/db/schema";
import { useLanguage } from "@/context/LanguageContext";
import { useAlert } from "@/context/AlertModalContext";

export default function ProfileScreen(): React.JSX.Element {
  const { profile: profileRepo, backup: backupRepo } = useDatabase();
  const { t, language, setLanguage } = useLanguage();
  const { showAlert } = useAlert();

  const [athlete, setAthlete] = useState<AthleteProfile | null>(null);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const loadProfileData = async () => {
    try {
      const p = await profileRepo.getProfile();
      setAthlete(p);
      const m = await profileRepo.getMeasurements();
      setMeasurements(m);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  const handleExportData = async () => {
    try {
      const archive = await backupRepo.exportDatabase();
      const json = JSON.stringify(archive, null, 2);
      showAlert({
        title: language === "tr" ? "Çevrimdışı Yedek Hazır" : "Offline Backup Ready",
        message:
          language === "tr"
            ? `Veritabanı başarıyla dışa aktarıldı!\n\nBoyut: ${(json.length / 1024).toFixed(1)} KB\nKayıtlar: ${
                archive.data.personalRecords.length
              } PR, ${archive.data.workoutSessions.length} Antrenman, ${archive.data.boxingSessions.length} Boks seansı.`
            : `Database exported successfully!\n\nPayload Size: ${(json.length / 1024).toFixed(1)} KB\nRecords: ${
                archive.data.personalRecords.length
              } PRs, ${archive.data.workoutSessions.length} Workouts, ${archive.data.boxingSessions.length} Boxing sessions.`,
        type: "success",
        confirmText: language === "tr" ? "Tamam" : "Done",
      });
    } catch (err: any) {
      showAlert({
        title: "Dışa Aktarma Hatası",
        message: err.message || "Failed to export database",
        type: "danger",
      });
    }
  };

  const bmi =
    athlete?.currentWeight && athlete?.height
      ? profileRepo.calculateBMI(athlete.currentWeight, athlete.height)
      : null;

  const sexLabel =
    athlete?.sex === "male"
      ? language === "tr" ? "Erkek" : "Male"
      : athlete?.sex === "female"
      ? language === "tr" ? "Kadın" : "Female"
      : language === "tr" ? "Belirtilmedi" : "Not specified";

  return (
    <ScreenContainer scrollable>
      {/* Edit Profile Modal */}
      <AthleteSetupModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSaved={loadProfileData}
        initialProfile={athlete}
        isFirstTime={false}
      />

      {/* Header */}
      <View className="mb-4 pt-1">
        <Text className="text-[11px] font-bold uppercase tracking-widest text-primary">
          {t("profileSubtitle")}
        </Text>
        <Text className="text-3xl font-black tracking-tight text-textPrimary">
          {t("profileTitle")}
        </Text>
      </View>

      {/* Language Switcher Setting Card */}
      <SectionHeader
        title={t("languageSetting")}
        subtitle={t("languageSub")}
      />
      <Card className="p-1.5 mb-5">
        <View className="flex-row">
          <Pressable
            onPress={() => setLanguage("tr")}
            className={`flex-1 py-2.5 items-center justify-center rounded-xl flex-row ${
              language === "tr" ? "bg-primary" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-xs font-black uppercase tracking-wider ${
                language === "tr" ? "text-black" : "text-textSecondary"
              }`}
            >
              🇹🇷 {t("turkish")}
            </Text>
            {language === "tr" ? (
              <Ionicons name="checkmark-circle" size={14} color="#000" style={{ marginLeft: 6 }} />
            ) : null}
          </Pressable>

          <Pressable
            onPress={() => setLanguage("en")}
            className={`flex-1 py-2.5 items-center justify-center rounded-xl flex-row ${
              language === "en" ? "bg-primary" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-xs font-black uppercase tracking-wider ${
                language === "en" ? "text-black" : "text-textSecondary"
              }`}
            >
              🇬🇧 {t("english")}
            </Text>
            {language === "en" ? (
              <Ionicons name="checkmark-circle" size={14} color="#000" style={{ marginLeft: 6 }} />
            ) : null}
          </Pressable>
        </View>
      </Card>

      {/* Athlete Information Card */}
      <Card variant="highlight" className="p-4 sm:p-5 mb-5">
        <View className="flex-row items-center justify-between mb-3.5">
          <View className="flex-row items-center flex-1 mr-2">
            <View className="h-14 w-14 rounded-2xl bg-surfaceHover border border-primary/40 items-center justify-center mr-3.5">
              <Ionicons name="person" size={26} color="#CCFF00" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-black text-textPrimary" numberOfLines={1}>
                {athlete?.displayName || (language === "tr" ? "Sporcu" : "Athlete")}
              </Text>
              <Text className="text-xs text-textSecondary font-medium">
                {athlete?.age ? `${athlete.age} ${language === "tr" ? "yaş" : "yrs"} • ` : ""}{sexLabel}
              </Text>
              <View className="flex-row items-center mt-1">
                <View className="h-2 w-2 rounded-full bg-success mr-1.5" />
                <Text className="text-[10px] font-bold text-success uppercase">
                  {t("localStorageActive")}
                </Text>
              </View>
            </View>
          </View>

          <Button
            title={language === "tr" ? "DÜZENLE" : "EDIT"}
            size="sm"
            variant="secondary"
            onPress={() => setShowEditModal(true)}
            icon={<Ionicons name="pencil" size={12} color="#CCFF00" />}
          />
        </View>

        {/* Biometrics Row */}
        <View className="flex-row gap-2 pt-2.5 border-t border-surfaceBorder">
          <StatCard
            label={t("weight")}
            value={athlete?.currentWeight ?? "--"}
            unit={athlete?.preferredWeightUnit ?? "kg"}
            className="p-2.5"
          />
          <StatCard
            label={t("height")}
            value={athlete?.height ?? "--"}
            unit={athlete?.preferredDistanceUnit ?? "cm"}
            className="p-2.5"
          />
          <StatCard
            label={language === "tr" ? "Cinsiyet" : "Sex"}
            value={athlete?.sex === "male" ? "M" : athlete?.sex === "female" ? "F" : "-"}
            className="p-2.5"
          />
        </View>

        {/* BMI Section */}
        {bmi && (
          <View className="mt-3.5 rounded-xl bg-surfaceHover p-3.5 border border-surfaceBorder">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[10px] font-black uppercase tracking-wider text-textSecondary">
                {language === "tr" ? "VÜCUT KİTLE İNDEKSİ (BMI)" : "BODY MASS INDEX (BMI)"}
              </Text>
              <View
                className={`px-2 py-0.5 rounded ${
                  bmi.categoryKey === "normal"
                    ? "bg-success/20"
                    : bmi.categoryKey === "overweight"
                    ? "bg-gold/20"
                    : "bg-danger/20"
                }`}
              >
                <Text
                  className={`text-[10px] font-extrabold uppercase ${
                    bmi.categoryKey === "normal"
                      ? "text-success"
                      : bmi.categoryKey === "overweight"
                      ? "text-gold"
                      : "text-danger"
                  }`}
                >
                  {bmi.category}
                </Text>
              </View>
            </View>

            <View className="flex-row items-baseline justify-between mt-1">
              <Text className="text-3xl font-black text-textPrimary">
                {bmi.bmi}{" "}
                <Text className="text-xs font-normal text-textMuted">kg/m²</Text>
              </Text>
              <Text className="text-[11px] font-bold text-textSecondary">
                {language === "tr" ? "İdeal Kilo: " : "Ideal Weight: "}
                <Text className="text-primary font-mono font-bold">
                  {bmi.healthyWeightRange.min} - {bmi.healthyWeightRange.max} kg
                </Text>
              </Text>
            </View>
          </View>
        )}
      </Card>

      {/* Body Measurements & History */}
      <SectionHeader
        title={t("bodyMetrics")}
        subtitle={t("bodyMetricsSub")}
      />
      <View className="gap-2.5 mb-5">
        {measurements.length > 0 ? (
          measurements.map((item) => (
            <Card key={item.id} className="p-3.5 flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-bold text-textPrimary capitalize">
                  {item.measurementType === "weight"
                    ? language === "tr" ? "Vücut Ağırlığı" : "Body Weight"
                    : item.measurementType}
                </Text>
                <Text className="text-xs text-textSecondary mt-0.5">{item.notes || "Yerel kayıt"}</Text>
              </View>
              <View className="items-end">
                <Text className="text-base font-black text-textPrimary">
                  {item.value} {item.unit}
                </Text>
                <Text className="text-[10px] text-textMuted font-mono">
                  {new Date(item.recordedAt).toLocaleDateString(language === "tr" ? "tr-TR" : "en-US")}
                </Text>
              </View>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={<Ionicons name="body-outline" size={32} color="#6B6B78" />}
            title={language === "tr" ? "Ölçüm Geçmişi Boş" : "No Measurements Yet"}
            description={
              language === "tr"
                ? "Profilinizi güncelledikçe kilo ve vücut ölçü geçmişiniz burada listelenecektir."
                : "Your body weight and metric logs will be stored here as you update your profile."
            }
          />
        )}
      </View>

      {/* Data Ownership & Backup */}
      <SectionHeader
        title={t("localDataBackup")}
        subtitle="Zero cloud dependency • 100% offline ownership"
      />
      <Card className="p-4 mb-6">
        <Text className="text-xs text-textSecondary leading-relaxed mb-4">
          {t("localDataDesc")}
        </Text>
        <View className="flex-col sm:flex-row gap-2.5">
          <Button
            title={t("exportBackup")}
            variant="secondary"
            onPress={handleExportData}
            className="flex-1"
            icon={<Ionicons name="download-outline" size={16} color="#CCFF00" />}
          />
          <Button
            title={t("restoreBackup")}
            variant="secondary"
            onPress={() => {
              showAlert({
                title: t("restoreBackup"),
                message:
                  language === "tr"
                    ? "Geçerli bir IRONPULSE JSON yedeği seçerek kayıtlarınızı güvenle geri yükleyebilirsiniz."
                    : "Select a valid IRONPULSE JSON backup archive to merge records safely.",
                type: "info",
                confirmText: language === "tr" ? "Anladım" : "Understood",
              });
            }}
            className="flex-1"
            icon={<Ionicons name="refresh-outline" size={16} color="#9E9EA8" />}
          />
        </View>
      </Card>
    </ScreenContainer>
  );
}
