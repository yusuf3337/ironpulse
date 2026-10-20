import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { CustomizeDayModal } from "@/components/workout/CustomizeDayModal";
import { useLanguage } from "@/context/LanguageContext";
import { useDatabase } from "@/db/useDatabase";
import { DayRoutine } from "@/db/repositories/programRepo";

export default function TrainScreen(): React.JSX.Element {
  const { t, language } = useLanguage();
  const { programs: programRepo } = useDatabase();

  const weekdays = [
    { key: "mon", label: t("mon"), full: t("monday") },
    { key: "tue", label: t("tue"), full: t("tuesday") },
    { key: "wed", label: t("wed"), full: t("wednesday") },
    { key: "thu", label: t("thu"), full: t("thursday") },
    { key: "fri", label: t("fri"), full: t("friday") },
    { key: "sat", label: t("sat"), full: t("saturday") },
    { key: "sun", label: t("sun"), full: t("sunday") },
  ];

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const selectedDay = weekdays[selectedDayIndex];

  const [currentRoutine, setCurrentRoutine] = useState<DayRoutine | null>(null);
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);

  const loadDayRoutine = async () => {
    try {
      const routine = await programRepo.getDayRoutine(selectedDay.key);
      setCurrentRoutine(routine);
    } catch (err) {
      console.error("Failed to load routine:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDayRoutine();
    }, [selectedDay.key])
  );

  const handleApplyTemplate = async (templateKey: "upper_lower" | "ppl" | "full_body", name: string) => {
    Alert.alert(
      language === "tr" ? "Şablonu Uygula" : "Apply Template",
      language === "tr"
        ? `"${name}" şablonunu haftalık takviminize uygulamak istiyor musunuz? Mevcut günleriniz bu plana göre düzenlenecektir.`
        : `Do you want to apply the "${name}" split to your weekly calendar?`,
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: language === "tr" ? "Uygula" : "Apply",
          onPress: async () => {
            try {
              await programRepo.applyTemplate(templateKey);
              loadDayRoutine();
              Alert.alert(
                language === "tr" ? "Başarılı" : "Success",
                language === "tr"
                  ? `"${name}" başarıyla haftalık programınıza aktarıldı!`
                  : `"${name}" has been applied to your training schedule!`
              );
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to apply template");
            }
          },
        },
      ]
    );
  };

  const isRest = currentRoutine?.isRest ?? false;
  const exercises = currentRoutine?.exercises ?? [];

  return (
    <ScreenContainer scrollable>
      {/* Day Customizer Modal */}
      <CustomizeDayModal
        visible={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        onSaved={loadDayRoutine}
        weekday={selectedDay.key}
        weekdayLabel={selectedDay.full}
        initialRoutine={currentRoutine}
      />

      {/* Header */}
      <View className="mb-4 pt-1">
        <Text className="text-[11px] font-bold uppercase tracking-widest text-primary">
          {t("trainSubtitle")}
        </Text>
        <Text className="text-3xl font-black tracking-tight text-textPrimary">
          {t("trainTitle")}
        </Text>
      </View>

      {/* Weekday Selector (Responsive items) */}
      <SectionHeader title={t("scheduleHeader")} subtitle={t("scheduleSub")} />
      <View className="flex-row gap-1.5 justify-between mb-4">
        {weekdays.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <Pressable
              key={day.key}
              onPress={() => setSelectedDayIndex(idx)}
              className={`flex-1 h-13 py-2 items-center justify-center rounded-xl border ${
                isSelected
                  ? "bg-primary border-primary"
                  : "bg-surface border-surfaceBorder"
              }`}
            >
              <Text
                className={`text-xs font-bold uppercase ${
                  isSelected ? "text-black" : "text-textSecondary"
                }`}
              >
                {day.label}
              </Text>
              <View
                className={`mt-1.5 h-1.5 w-1.5 rounded-full ${
                  isSelected ? "bg-black" : "bg-primary"
                }`}
              />
            </Pressable>
          );
        })}
      </View>

      {/* Selected Day Routine Card */}
      <Card variant="highlight" className="mb-5 p-4 sm:p-5">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xs font-black uppercase tracking-wider text-primary">
            {selectedDay.full}
          </Text>
          <View className="rounded-full bg-surfaceHover px-2.5 py-0.5 border border-surfaceBorder">
            <Text className="text-[10px] font-bold text-textSecondary uppercase">
              {isRest
                ? t("recovery")
                : `${exercises.length} ${language === "tr" ? "Hareket" : "Exercises"}`}
            </Text>
          </View>
        </View>

        <Text className="text-2xl font-black text-textPrimary mb-3">
          {currentRoutine?.title || (isRest ? "Dinlenme Günü" : "Antrenman Günü")}
        </Text>

        {!isRest ? (
          exercises.length > 0 ? (
            <View className="gap-2.5 mb-5 border-t border-surfaceBorder pt-3">
              {exercises.map((ex, idx) => (
                <View key={ex.id || idx} className="flex-row items-center justify-between">
                  <Text className="text-xs font-semibold text-textPrimary flex-1 mr-2">
                    {idx + 1}. {ex.exerciseName}
                  </Text>
                  <Text className="text-xs text-textMuted font-mono">
                    {ex.targetSets} set × {ex.targetReps}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="py-4 items-center justify-center border-t border-surfaceBorder mb-4">
              <Text className="text-xs text-textSecondary text-center">
                {language === "tr"
                  ? "Bu güne henüz hareket eklenmedi. 'Günü Düzenle' butonuna basarak kütüphaneden hareket seçebilirsiniz."
                  : "No exercises assigned for this day yet. Tap 'Customize Day' to pick movements from the catalog."}
              </Text>
            </View>
          )
        ) : (
          <Text className="text-xs text-textSecondary mb-5 leading-relaxed">
            {t("restDayMessage")}
          </Text>
        )}

        <View className="flex-col sm:flex-row gap-2.5">
          {!isRest && exercises.length > 0 && (
            <Button
              title={t("startThisSession")}
              onPress={() => router.push("/workouts/active")}
              className="flex-1"
              icon={<Ionicons name="play" size={16} color="#000" />}
            />
          )}
          <Button
            title={t("customizeDay")}
            variant="secondary"
            onPress={() => setShowCustomizeModal(true)}
            className={isRest || exercises.length === 0 ? "flex-1" : ""}
            icon={<Ionicons name="pencil" size={14} color="#9E9EA8" />}
          />
        </View>
      </Card>

      {/* Prebuilt Templates Section */}
      <SectionHeader
        title={t("builtInSplits")}
        subtitle={t("builtInSub")}
      />
      <View className="gap-2.5 mb-6">
        {[
          {
            key: "upper_lower" as const,
            name: language === "tr" ? "Üst / Alt Vücut (Upper/Lower Split)" : "Upper / Lower Split",
            days: language === "tr" ? "4 gün / hafta" : "4 days / week",
            desc: language === "tr" ? "Dengeli hipertrofi ve kuvvet artışı" : "Balanced hypertrophy and strength progression",
          },
          {
            key: "ppl" as const,
            name: language === "tr" ? "İtiş / Çekiş / Bacak (PPL)" : "Push / Pull / Legs (PPL)",
            days: language === "tr" ? "6 gün / hafta" : "6 days / week",
            desc: language === "tr" ? "Klasik yüksek frekanslı kas geliştirme rutini" : "Classic high-frequency muscle builder",
          },
          {
            key: "full_body" as const,
            name: language === "tr" ? "Tüm Vücut Temeli (Full Body)" : "Full Body Foundation",
            days: language === "tr" ? "3 gün / hafta" : "3 days / week",
            desc: language === "tr" ? "Maksimum verim, kuvvet ve kondisyon" : "Optimal efficiency for strength and conditioning",
          },
        ].map((template) => (
          <Card key={template.key} className="p-3.5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-2">
                <View className="flex-row items-center mb-1 flex-wrap">
                  <Text className="text-sm font-bold text-textPrimary mr-2">
                    {template.name}
                  </Text>
                  <Text className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {template.days}
                  </Text>
                </View>
                <Text numberOfLines={1} className="text-xs text-textSecondary">
                  {template.desc}
                </Text>
              </View>
              <Button
                title={t("useTemplate")}
                size="sm"
                variant="secondary"
                onPress={() => handleApplyTemplate(template.key, template.name)}
              />
            </View>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}
