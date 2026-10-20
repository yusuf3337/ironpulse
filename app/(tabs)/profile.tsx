import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useDatabase } from "@/db/useDatabase";
import { AthleteProfile, BodyMeasurement } from "@/db/schema";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfileScreen(): React.JSX.Element {
  const { profile: profileRepo, backup: backupRepo } = useDatabase();
  const { t, language, setLanguage } = useLanguage();

  const [athlete, setAthlete] = useState<AthleteProfile | null>(null);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const p = await profileRepo.getProfile();
      if (p) setAthlete(p);
      const m = await profileRepo.getMeasurements();
      setMeasurements(m);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  const handleExportData = async () => {
    try {
      const archive = await backupRepo.exportDatabase();
      const json = JSON.stringify(archive, null, 2);
      Alert.alert(
        language === "tr" ? "Çevrimdışı Yedek Hazır" : "Offline Backup Archive Ready",
        language === "tr"
          ? `Veritabanı başarıyla dışa aktarıldı!\n\nBoyut: ${(json.length / 1024).toFixed(1)} KB\nKayıtlar: ${
              archive.data.personalRecords.length
            } PR, ${archive.data.workoutSessions.length} Antrenman, ${archive.data.boxingSessions.length} Boks seansı.`
          : `Database exported successfully!\n\nPayload Size: ${(json.length / 1024).toFixed(1)} KB\nRecords: ${
              archive.data.personalRecords.length
            } PRs, ${archive.data.workoutSessions.length} Workouts, ${archive.data.boxingSessions.length} Boxing sessions.`,
        [{ text: "Tamam" }]
      );
    } catch (err: any) {
      Alert.alert("Export Error", err.message || "Failed to export database");
    }
  };

  return (
    <ScreenContainer scrollable>
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
      <Card className="p-2 mb-5">
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

      {/* Athlete Card */}
      <Card variant="highlight" className="p-4 sm:p-5 mb-5">
        <View className="flex-row items-center mb-3.5">
          <View className="h-14 w-14 rounded-2xl bg-surfaceHover border border-primary/40 items-center justify-center mr-3.5">
            <Ionicons name="person" size={26} color="#CCFF00" />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-black text-textPrimary">
              {athlete?.displayName || (language === "tr" ? "Demir Sporcu" : "Iron Athlete")}
            </Text>
            <Text className="text-xs text-textSecondary font-medium">
              {t("offlineAthlete")} • {athlete?.age ? `${athlete.age} yaş` : "Aktif"}
            </Text>
            <View className="flex-row items-center mt-1">
              <View className="h-2 w-2 rounded-full bg-success mr-1.5" />
              <Text className="text-[10px] font-bold text-success uppercase">
                {t("localStorageActive")}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-2 pt-2 border-t border-surfaceBorder">
          <StatCard
            label={t("weight")}
            value={athlete?.currentWeight ?? 82.5}
            unit={athlete?.preferredWeightUnit ?? "kg"}
            className="p-2.5"
          />
          <StatCard
            label={t("height")}
            value={athlete?.height ?? 180}
            unit={athlete?.preferredDistanceUnit ?? "cm"}
            className="p-2.5"
          />
          <StatCard
            label={t("storage")}
            value="100%"
            unit={t("local")}
            highlight
            className="p-2.5"
          />
        </View>
      </Card>

      {/* Body Measurements & Journal */}
      <SectionHeader
        title={t("bodyMetrics")}
        subtitle={t("bodyMetricsSub")}
        actionLabel={t("logMetric")}
        onAction={() => {
          Alert.alert(
            t("logMetric"),
            language === "tr"
              ? "Kilo veya çevre ölçümü eklemek için değer giriniz."
              : "Enter body weight or circumference measurement."
          );
        }}
      />
      <View className="gap-2.5 mb-5">
        {measurements.length > 0 ? (
          measurements.map((item) => (
            <Card key={item.id} className="p-3.5 flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-bold text-textPrimary capitalize">
                  {item.measurementType}
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
          [
            {
              label: language === "tr" ? "Vücut Ağırlığı" : "Body Weight",
              current: `${athlete?.currentWeight ?? 82.5} kg`,
              change: language === "tr" ? "Hedef: Yağsız Hipertrofi" : "Target: Lean Hypertrophy",
            },
            {
              label: language === "tr" ? "Bel Çevresi" : "Waist Circumference",
              current: "81 cm",
              change: language === "tr" ? "Temel Başlangıç Değeri" : "Baseline Measurement",
            },
            {
              label: language === "tr" ? "Göğüs Çevresi" : "Chest Circumference",
              current: "108 cm",
              change: language === "tr" ? "Temel Başlangıç Değeri" : "Baseline Measurement",
            },
            {
              label: language === "tr" ? "Kol Çevresi" : "Arm Circumference",
              current: "40.5 cm",
              change: language === "tr" ? "Temel Başlangıç Değeri" : "Baseline Measurement",
            },
          ].map((item, idx) => (
            <Card key={idx} className="p-3.5 flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-bold text-textPrimary">{item.label}</Text>
                <Text className="text-xs text-textSecondary mt-0.5">{item.change}</Text>
              </View>
              <View className="items-end">
                <Text className="text-base font-black text-textPrimary">{item.current}</Text>
                <Text className="text-[10px] text-textMuted font-mono">{t("local")}</Text>
              </View>
            </Card>
          ))
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
              Alert.alert(
                t("restoreBackup"),
                language === "tr"
                  ? "Geçerli bir IRONPULSE JSON yedeği seçerek kayıtlarınızı güvenle geri yükleyebilirsiniz."
                  : "Select a valid IRONPULSE JSON backup archive to merge records safely."
              );
            }}
            className="flex-1"
            icon={<Ionicons name="refresh-outline" size={16} color="#9E9EA8" />}
          />
        </View>
      </Card>
    </ScreenContainer>
  );
}
