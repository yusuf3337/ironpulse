import React, { useState, useCallback } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLanguage } from "@/context/LanguageContext";
import { useDatabase } from "@/db/useDatabase";
import { BoxingPreset } from "@/db/schema";
import { CreateBoxingPresetModal } from "@/components/boxing/CreateBoxingPresetModal";

export default function BoxingScreen(): React.JSX.Element {
  const { t, language } = useLanguage();
  const { boxing: boxingRepo } = useDatabase();
  const [activeTab, setActiveTab] = useState<"timer" | "techniques" | "combos">("timer");
  const [presets, setPresets] = useState<BoxingPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const formatTime = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder.toString().padStart(2, "0")}`;
  };

  const loadPresets = useCallback(async () => {
    try {
      const dbPresets = await boxingRepo.getPresets();
      if (dbPresets.length > 0) {
        setPresets(dbPresets);
        setSelectedPresetId((prev) => prev ?? dbPresets[0].id);
      } else {
        // Fallback default presets if table empty
        const defaults: BoxingPreset[] = [
          {
            id: "b-pre-1",
            name: language === "tr" ? "Profesyonel Şampiyona" : "Pro Championship",
            rounds: 12,
            workSeconds: 180,
            restSeconds: 60,
            prepSeconds: 10,
            soundEnabled: true,
            hapticsEnabled: true,
          },
          {
            id: "b-pre-2",
            name: language === "tr" ? "Standart Boks / Sparring" : "Standard Sparring",
            rounds: 6,
            workSeconds: 180,
            restSeconds: 60,
            prepSeconds: 10,
            soundEnabled: true,
            hapticsEnabled: true,
          },
          {
            id: "b-pre-3",
            name: language === "tr" ? "Ağır Torba Kondisyon" : "Heavy Bag Conditioning",
            rounds: 8,
            workSeconds: 120,
            restSeconds: 45,
            prepSeconds: 10,
            soundEnabled: true,
            hapticsEnabled: true,
          },
          {
            id: "b-pre-4",
            name: language === "tr" ? "Hız & Gölge Boksu" : "Speed & Shadowboxing",
            rounds: 4,
            workSeconds: 120,
            restSeconds: 30,
            prepSeconds: 10,
            soundEnabled: true,
            hapticsEnabled: true,
          },
        ];
        setPresets(defaults);
        setSelectedPresetId((prev) => prev ?? defaults[0].id);
      }
    } catch (err) {
      console.error("Failed to load boxing presets:", err);
    }
  }, [boxingRepo, language]);

  useFocusEffect(
    useCallback(() => {
      loadPresets();
    }, [loadPresets])
  );

  const activePreset = presets.find((p) => p.id === selectedPresetId) || presets[0];

  const handleLaunchTimer = (preset: BoxingPreset) => {
    router.push({
      pathname: "/boxing/timer",
      params: {
        rounds: String(preset.rounds),
        work: String(preset.workSeconds),
        rest: String(preset.restSeconds),
        prep: String(preset.prepSeconds),
        title: preset.name,
      },
    });
  };

  const handleDeletePreset = (preset: BoxingPreset) => {
    Alert.alert(
      language === "tr" ? "Sayacı Sil" : "Delete Preset",
      language === "tr"
        ? `"${preset.name}" sayacını silmek istediğinizden emin misiniz?`
        : `Are you sure you want to delete "${preset.name}"?`,
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: language === "tr" ? "Sil" : "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await boxingRepo.deletePreset(preset.id);
              await loadPresets();
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to delete preset");
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <View className="mb-4 pt-1">
        <Text className="text-[11px] font-bold uppercase tracking-widest text-primary">
          {t("boxingSubtitle")}
        </Text>
        <Text className="text-3xl font-black tracking-tight text-textPrimary">
          {t("boxingTitle")}
        </Text>
      </View>

      {/* Mode Segment Bar */}
      <View className="flex-row rounded-xl bg-surface border border-surfaceBorder p-1 mb-5">
        <Pressable
          onPress={() => setActiveTab("timer")}
          className={`flex-1 py-2 items-center justify-center rounded-lg ${
            activeTab === "timer" ? "bg-primary" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-xs font-bold uppercase tracking-wider ${
              activeTab === "timer" ? "text-black" : "text-textSecondary"
            }`}
          >
            {t("roundTimerTab")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("techniques")}
          className={`flex-1 py-2 items-center justify-center rounded-lg ${
            activeTab === "techniques" ? "bg-primary" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-xs font-bold uppercase tracking-wider ${
              activeTab === "techniques" ? "text-black" : "text-textSecondary"
            }`}
          >
            {t("techniquesTab")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("combos")}
          className={`flex-1 py-2 items-center justify-center rounded-lg ${
            activeTab === "combos" ? "bg-primary" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-xs font-bold uppercase tracking-wider ${
              activeTab === "combos" ? "text-black" : "text-textSecondary"
            }`}
          >
            {t("combosTab")}
          </Text>
        </Pressable>
      </View>

      {activeTab === "timer" && (
        <View>
          {/* Quick Active Preset Banner */}
          {activePreset && (
            <Card variant="highlight" className="p-5 mb-5">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-black uppercase tracking-wider text-primary">
                  {t("readyToBox")}
                </Text>
                <View className="rounded-full bg-primary/20 px-2.5 py-0.5">
                  <Text className="text-[10px] font-extrabold text-primary uppercase">
                    {activePreset.rounds} {t("roundsUnit")} × {formatTime(activePreset.workSeconds)}
                  </Text>
                </View>
              </View>

              <Text className="text-2xl font-black text-textPrimary mb-1">
                {activePreset.name}
              </Text>
              <Text className="text-xs text-textSecondary mb-4">
                {language === "tr"
                  ? `Dövüş: ${formatTime(activePreset.workSeconds)} • Dinlenme: ${formatTime(activePreset.restSeconds)} • Hazırlık: ${activePreset.prepSeconds}s`
                  : `Work: ${formatTime(activePreset.workSeconds)} • Rest: ${formatTime(activePreset.restSeconds)} • Prep: ${activePreset.prepSeconds}s`}
              </Text>

              <Button
                title={t("launchTimer")}
                onPress={() => handleLaunchTimer(activePreset)}
                size="lg"
                icon={<Ionicons name="play" size={20} color="#000" />}
              />
            </Card>
          )}

          {/* Presets List */}
          <SectionHeader
            title={t("savedPresets")}
            subtitle={t("presetsSub")}
            actionLabel={t("customPreset")}
            onAction={() => setShowCreateModal(true)}
          />
          <View className="gap-2.5 mb-5">
            {presets.map((preset) => {
              const isSelected = preset.id === activePreset?.id;
              const isCustom = !preset.id.startsWith("b-pre-") || preset.id.startsWith("b-pre-17"); // generated timestamp or custom
              return (
                <Pressable
                  key={preset.id}
                  onPress={() => setSelectedPresetId(preset.id)}
                >
                  <Card
                    className={`p-3.5 flex-row items-center justify-between ${
                      isSelected ? "border-primary/60 bg-surfaceHover" : ""
                    }`}
                  >
                    <View className="flex-1 mr-2">
                      <View className="flex-row items-center">
                        <Text className="text-sm font-bold text-textPrimary">
                          {preset.name}
                        </Text>
                        {isSelected && (
                          <View className="ml-2 rounded-full bg-primary/20 px-2 py-0.5">
                            <Text className="text-[9px] font-black uppercase text-primary">
                              {language === "tr" ? "Seçili" : "Selected"}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-textSecondary mt-0.5">
                        {preset.rounds} {t("roundsUnit")} • {formatTime(preset.workSeconds)} {language === "tr" ? "dövüş" : "work"} • {preset.restSeconds}s {language === "tr" ? "dinlenme" : "rest"} • {preset.prepSeconds}s {language === "tr" ? "hazırlık" : "prep"}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-1.5">
                      {isCustom && (
                        <Pressable
                          onPress={() => handleDeletePreset(preset)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          className="h-9 w-9 items-center justify-center rounded-lg bg-surface border border-surfaceBorder active:opacity-70"
                        >
                          <Ionicons name="trash-outline" size={16} color="#FF453A" />
                        </Pressable>
                      )}
                      <Button
                        title={t("start")}
                        size="sm"
                        variant={isSelected ? "primary" : "secondary"}
                        onPress={() => handleLaunchTimer(preset)}
                      />
                    </View>
                  </Card>
                </Pressable>
              );
            })}

            {/* Quick Button to Create New Timer */}
            <Button
              title={language === "tr" ? "+ YENİ ÖZEL SAYAÇ OLUŞTUR" : "+ CREATE CUSTOM TIMER"}
              variant="secondary"
              size="md"
              onPress={() => setShowCreateModal(true)}
              className="mt-1"
              icon={<Ionicons name="add" size={18} color="#CCFF00" />}
            />
          </View>

          {/* Modal for Creating Custom Boxing Preset */}
          <CreateBoxingPresetModal
            visible={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSaved={loadPresets}
          />
        </View>
      )}

      {activeTab === "techniques" && (
        <View className="gap-3.5">
          <SectionHeader
            title={t("punchArsenal")}
            subtitle={t("punchSub")}
          />
          {[
            {
              name: "Direkt Sol / Jab (#1)",
              type: language === "tr" ? "Ön El" : "Lead Hand",
              cue: language === "tr" ? "Omuzu çeneye yapıştır, yumruğu hızla fırlatıp geri çek, avuç içi yere baksın." : "Snap straight, rotate palm down, chin tucked",
            },
            {
              name: "Sağ Direkt / Cross (#2)",
              type: language === "tr" ? "Arka Güç Eli" : "Rear Hand",
              cue: language === "tr" ? "Arka ayağın parmak ucunda kalçayı döndür, tam uzanış ile ağırlığı aktar." : "Drive off rear foot, rotate hips, full extension",
            },
            {
              name: "Sol Kroşe / Lead Hook (#3)",
              type: language === "tr" ? "Ön El" : "Lead Hand",
              cue: language === "tr" ? "Ön ayağı 90° döndür, dirsek yumruk hizasında yatay bir yay çizsin." : "Pivot front foot 90°, elbow level with fist",
            },
            {
              name: "Sağ Aparkat / Uppercut (#6)",
              type: language === "tr" ? "Güç Eli" : "Power Hand",
              cue: language === "tr" ? "Dizleri hafif kırıp yukarıya doğru patlayıcı kuvvet üret, rakip gardının arasından vur." : "Drop hips, drive upwards through opponent's guard",
            },
          ].map((item) => (
            <Card key={item.name} className="p-3.5">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm font-bold text-textPrimary">{item.name}</Text>
                <Text className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {item.type}
                </Text>
              </View>
              <Text className="text-xs text-textSecondary leading-relaxed">{item.cue}</Text>
            </Card>
          ))}

          <SectionHeader
            title={t("defenseSystem")}
            subtitle={t("defenseSub")}
          />
          {[
            {
              name: language === "tr" ? "Eskiş (Slip - İç & Dış)" : "Slip (Inside & Outside)",
              desc: language === "tr" ? "Bel ve dizlerden hafif bükülerek yumruk çizgisinin dışına çıkın." : "Bend at waist and knees off the center line",
            },
            {
              name: language === "tr" ? "Roll / Bob & Weave (Kroşe Altından Kaçış)" : "Roll / Bob & Weave",
              desc: language === "tr" ? "U harfi çizerek kroşenin altından kayıp ters taraftan pozisyon alın." : "Underhand duck forming a U-shape under hooks",
            },
            {
              name: language === "tr" ? "Yüksek Gard Blok (High Guard)" : "High Guard Block",
              desc: language === "tr" ? "Eldivenler şakaklara yapışık, dirsekler gövdeyi ve çeneyi kalkan gibi örter." : "Gloves glued to temples, absorb force through elbows",
            },
          ].map((def) => (
            <Card key={def.name} className="p-3.5">
              <Text className="text-sm font-bold text-textPrimary">{def.name}</Text>
              <Text className="text-xs text-textSecondary mt-0.5 leading-relaxed">{def.desc}</Text>
            </Card>
          ))}
        </View>
      )}

      {activeTab === "combos" && (
        <View className="gap-2.5">
          <SectionHeader
            title={t("savedCombos")}
            subtitle={t("combosSub")}
            actionLabel={t("buildCombo")}
            onAction={() => {}}
          />
          {[
            {
              name: language === "tr" ? "Klasik 1-2 Kombinasyonu" : "The Classic 1-2",
              seq: ["1 - Jab", "2 - Cross"],
              desc: language === "tr" ? "Mesafe ayarlama ve ani arka el gücü." : "Fundamental range finder and power finish",
            },
            {
              name: language === "tr" ? "Sol Kroşe Tuzağı (1-2-3)" : "Power Hook Trap",
              seq: ["1 - Jab", "2 - Cross", "3 - Lead Hook"],
              desc: language === "tr" ? "Rakibin gardını öne çekip yan taraftan vuruş." : "Forces high guard and wraps around right side",
            },
            {
              name: language === "tr" ? "Gövde - Kafa Yıkımı" : "Body-Head Destruction",
              seq: ["1 - Jab", "Slip", "6 - Gövde Aparkat", "3 - Kafa Kroşe"],
              desc: language === "tr" ? "Seviye değiştirerek savunmayı çözme kombosu." : "Levels changes to open tight defenses",
            },
          ].map((combo) => (
            <Card key={combo.name} className="p-3.5">
              <Text className="text-sm font-bold text-textPrimary mb-2">{combo.name}</Text>
              <View className="flex-row flex-wrap gap-1.5 mb-2">
                {combo.seq.map((step, idx) => (
                  <View key={idx} className="bg-surfaceHover border border-surfaceBorder px-2.5 py-1 rounded-md">
                    <Text className="text-[11px] font-mono font-bold text-primary">{step}</Text>
                  </View>
                ))}
              </View>
              <Text className="text-xs text-textSecondary">{combo.desc}</Text>
            </Card>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
