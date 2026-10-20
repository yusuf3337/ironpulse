import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLanguage } from "@/context/LanguageContext";

export default function TrainScreen(): React.JSX.Element {
  const { t, language } = useLanguage();

  const weekdays = [
    { key: "mon", label: t("mon"), full: t("monday"), focus: language === "tr" ? "Üst Vücut Güç" : "Upper Body", isRest: false },
    { key: "tue", label: t("tue"), full: t("tuesday"), focus: language === "tr" ? "Alt Vücut & Bacak" : "Lower Body", isRest: false },
    { key: "wed", label: t("wed"), full: t("wednesday"), focus: language === "tr" ? "Aktif Toparlanma & Dinlenme" : "Rest & Active Recovery", isRest: true },
    { key: "thu", label: t("thu"), full: t("thursday"), focus: language === "tr" ? "İtiş (Push) Kuvveti" : "Push Strength", isRest: false },
    { key: "fri", label: t("fri"), full: t("friday"), focus: language === "tr" ? "Çekiş (Pull) Kuvveti" : "Pull Strength", isRest: false },
    { key: "sat", label: t("sat"), full: t("saturday"), focus: language === "tr" ? "Boks & Kondisyon" : "Boxing & Conditioning", isRest: false },
    { key: "sun", label: t("sun"), full: t("sunday"), focus: language === "tr" ? "Tam Dinlenme" : "Rest Day", isRest: true },
  ];

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const selectedDay = weekdays[selectedDayIndex];

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <View className="mb-4 pt-1">
        <Text className="text-[11px] font-bold uppercase tracking-widest text-primary">
          {t("trainSubtitle")}
        </Text>
        <Text className="text-3xl font-black tracking-tight text-textPrimary">
          {t("trainTitle")}
        </Text>
      </View>

      {/* Weekday Selector (Responsive flexible items) */}
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
                  : day.isRest
                  ? "bg-surface/50 border-surfaceBorder/40 opacity-70"
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
                  isSelected
                    ? "bg-black"
                    : day.isRest
                    ? "bg-textMuted"
                    : "bg-primary"
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
              {selectedDay.isRest ? t("recovery") : "4 Hareket • ~50 dk"}
            </Text>
          </View>
        </View>

        <Text className="text-2xl font-black text-textPrimary mb-3">
          {selectedDay.focus}
        </Text>

        {!selectedDay.isRest ? (
          <View className="gap-2.5 mb-5 border-t border-surfaceBorder pt-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-textPrimary">
                1. Barbell Bench Press
              </Text>
              <Text className="text-xs text-textMuted font-mono">4 set × 6-8 tekrar</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-textPrimary">
                2. Incline Dumbbell Press
              </Text>
              <Text className="text-xs text-textMuted font-mono">3 set × 8-10 tekrar</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-textPrimary">
                3. Standing Overhead Press
              </Text>
              <Text className="text-xs text-textMuted font-mono">3 set × 8 tekrar</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-textPrimary">
                4. Tricep Rope Pushdown
              </Text>
              <Text className="text-xs text-textMuted font-mono">3 set × 12 tekrar</Text>
            </View>
          </View>
        ) : (
          <Text className="text-xs text-textSecondary mb-5 leading-relaxed">
            {t("restDayMessage")}
          </Text>
        )}

        <View className="flex-col sm:flex-row gap-2.5">
          {!selectedDay.isRest && (
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
            onPress={() => {}}
            className={selectedDay.isRest ? "flex-1" : ""}
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
            name: language === "tr" ? "Üst / Alt Vücut (Upper/Lower)" : "Upper / Lower Split",
            days: language === "tr" ? "4 gün / hafta" : "4 days / week",
            desc: language === "tr" ? "Dengeli hipertrofi ve kuvvet artışı" : "Balanced hypertrophy and strength progression",
          },
          {
            name: language === "tr" ? "İtiş / Çekiş / Bacak (PPL)" : "Push / Pull / Legs (PPL)",
            days: language === "tr" ? "6 gün / hafta" : "6 days / week",
            desc: language === "tr" ? "Klasik yüksek frekanslı kas geliştirme rutini" : "Classic high-frequency muscle builder",
          },
          {
            name: language === "tr" ? "Tüm Vücut Temeli (Full Body)" : "Full Body Foundation",
            days: language === "tr" ? "3 gün / hafta" : "3 days / week",
            desc: language === "tr" ? "Maksimum verim, kuvvet ve kondisyon" : "Optimal efficiency for strength and conditioning",
          },
        ].map((template) => (
          <Card key={template.name} className="p-3.5">
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
                onPress={() => {}}
              />
            </View>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}
