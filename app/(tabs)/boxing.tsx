import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLanguage } from "@/context/LanguageContext";
import { useAlert } from "@/context/AlertModalContext";
import { useDatabase } from "@/db/useDatabase";
import { BoxingPreset } from "@/db/schema";
import { CreateBoxingPresetModal } from "@/components/boxing/CreateBoxingPresetModal";

export default function BoxingScreen(): React.JSX.Element {
  const { t, language } = useLanguage();
  const { showAlert, showConfirm } = useAlert();
  const { boxing: boxingRepo } = useDatabase();

  const [activeTab, setActiveTab] = useState<"timer" | "combos" | "techniques">("timer");
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
            name: language === "tr" ? "Standart Sparring" : "Standard Sparring",
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

  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  const activePreset = presets.find((p) => p.id === selectedPresetId) || presets[0];

  const handleLaunchTimer = (preset: BoxingPreset) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
    showConfirm({
      title: language === "tr" ? "Sayacı Sil" : "Delete Preset",
      message:
        language === "tr"
          ? `"${preset.name}" sayacını silmek istediğinizden emin misiniz?`
          : `Are you sure you want to delete "${preset.name}"?`,
      type: "danger",
      confirmText: language === "tr" ? "Sil" : "Delete",
      cancelText: t("cancel"),
      onConfirm: async () => {
        try {
          await boxingRepo.deletePreset(preset.id);
          await loadPresets();
        } catch (err: any) {
          showAlert({
            title: "Hata",
            message: err.message || "Failed to delete preset",
            type: "danger",
          });
        }
      },
    });
  };

  return (
    <ScreenContainer scrollable>
      {/* Top Header with Jabb-inspired energy badge */}
      <View className="mb-4 pt-1">
        <View className="flex-row items-center gap-2 self-start rounded-full bg-crimson/15 border border-crimson/30 px-3 py-1 mb-2">
          <View className="h-2 w-2 rounded-full bg-crimson" />
          <Text className="text-[10px] font-black uppercase tracking-widest text-crimson">
            {language === "tr" ? "BOKS AKADEMİSİ • DÖVÜŞ ZİLLERİ" : "FIGHT CAMP • BOXING ROUNDS"}
          </Text>
        </View>

        <Text className="text-3xl sm:text-4xl font-black tracking-tight text-textPrimary">
          {language === "tr" ? "Bir Boksör Gibi Dövüş" : "Train Like a Fighter"}
        </Text>
        <Text className="text-xs sm:text-sm font-medium text-textSecondary mt-1 leading-relaxed">
          {language === "tr"
            ? "Otantik raunt zilleri, dinlenme aralıkları ve dövüş kombinasyonları."
            : "Authentic ring bells, rest horns, and coach-curated combinations."}
        </Text>
      </View>

      {/* Jabb-Style Segmented Pill Bar */}
      <View className="flex-row rounded-full bg-[#15151A] border border-surfaceBorder p-1 mb-5">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab("timer");
          }}
          className={`flex-1 py-2.5 items-center justify-center rounded-full flex-row gap-1.5 ${
            activeTab === "timer" ? "bg-crimson" : "bg-transparent"
          }`}
        >
          <Ionicons
            name="timer"
            size={14}
            color={activeTab === "timer" ? "#FFFFFF" : "#9E9EA8"}
          />
          <Text
            className={`text-xs font-black uppercase tracking-wider ${
              activeTab === "timer" ? "text-white" : "text-textSecondary"
            }`}
          >
            {language === "tr" ? "Sayaçlar" : "Timers"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab("combos");
          }}
          className={`flex-1 py-2.5 items-center justify-center rounded-full flex-row gap-1.5 ${
            activeTab === "combos" ? "bg-crimson" : "bg-transparent"
          }`}
        >
          <Ionicons
            name="flame"
            size={14}
            color={activeTab === "combos" ? "#FFFFFF" : "#9E9EA8"}
          />
          <Text
            className={`text-xs font-black uppercase tracking-wider ${
              activeTab === "combos" ? "text-white" : "text-textSecondary"
            }`}
          >
            {language === "tr" ? "Kombolar" : "Combos"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab("techniques");
          }}
          className={`flex-1 py-2.5 items-center justify-center rounded-full flex-row gap-1.5 ${
            activeTab === "techniques" ? "bg-crimson" : "bg-transparent"
          }`}
        >
          <Ionicons
            name="flash"
            size={14}
            color={activeTab === "techniques" ? "#FFFFFF" : "#9E9EA8"}
          />
          <Text
            className={`text-xs font-black uppercase tracking-wider ${
              activeTab === "techniques" ? "text-white" : "text-textSecondary"
            }`}
          >
            {language === "tr" ? "Vuruşlar" : "Arsenal"}
          </Text>
        </Pressable>
      </View>

      {/* TAB 1: SAYAÇLAR (Timers) */}
      {activeTab === "timer" && (
        <View>
          {/* Featured Active Preset Card (Jabb Hero Style) */}
          {activePreset && (
            <View className="mb-6 rounded-[28px] overflow-hidden border border-crimson/40 bg-[#141419] p-5">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-1.5">
                  <View className="h-2 w-2 rounded-full bg-crimson" />
                  <Text className="text-[10px] font-black uppercase tracking-widest text-crimson">
                    {language === "tr" ? "HAZIR RAUNT SAYACI" : "CURRENT RING SETUP"}
                  </Text>
                </View>
                <View className="rounded-full bg-crimson/20 border border-crimson/30 px-2.5 py-0.5">
                  <Text className="text-[10px] font-black text-white uppercase">
                    {activePreset.rounds} {t("roundsUnit")} × {formatTime(activePreset.workSeconds)}
                  </Text>
                </View>
              </View>

              <Text className="text-2xl sm:text-3xl font-black text-textPrimary tracking-tight mb-1">
                {activePreset.name}
              </Text>

              {/* Time Breakdown Chips */}
              <View className="flex-row flex-wrap items-center gap-2 my-3">
                <View className="flex-row items-center gap-1 bg-[#1E1E24] border border-[#2B2B34] rounded-xl px-2.5 py-1.5">
                  <Ionicons name="flame" size={13} color="#D81E3C" />
                  <Text className="text-xs font-bold text-textPrimary">
                    {formatTime(activePreset.workSeconds)}{" "}
                    <Text className="text-textSecondary font-normal">
                      {language === "tr" ? "Dövüş" : "Work"}
                    </Text>
                  </Text>
                </View>

                <View className="flex-row items-center gap-1 bg-[#1E1E24] border border-[#2B2B34] rounded-xl px-2.5 py-1.5">
                  <Ionicons name="water" size={13} color="#38BDF8" />
                  <Text className="text-xs font-bold text-textPrimary">
                    {activePreset.restSeconds}s{" "}
                    <Text className="text-textSecondary font-normal">
                      {language === "tr" ? "Dinlenme" : "Rest"}
                    </Text>
                  </Text>
                </View>

                <View className="flex-row items-center gap-1 bg-[#1E1E24] border border-[#2B2B34] rounded-xl px-2.5 py-1.5">
                  <Ionicons name="notifications" size={13} color="#CCFF00" />
                  <Text className="text-xs font-bold text-textPrimary">
                    {activePreset.prepSeconds}s{" "}
                    <Text className="text-textSecondary font-normal">
                      {language === "tr" ? "Hazırlık" : "Prep"}
                    </Text>
                  </Text>
                </View>
              </View>

              {/* Huge Jabb-style Action Button */}
              <Pressable
                onPress={() => handleLaunchTimer(activePreset)}
                className="mt-2 h-14 rounded-2xl bg-crimson active:bg-crimsonDark flex-row items-center justify-center gap-2"
              >
                <Ionicons name="play" size={20} color="#FFFFFF" />
                <Text className="text-base font-black tracking-wide text-white uppercase">
                  {language === "tr" ? "SAYACI BAŞLAT" : "START ROUNDS"}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Preset List Header */}
          <SectionHeader
            title={language === "tr" ? "Raunt Listesi" : "Round Presets"}
            subtitle={
              language === "tr"
                ? "Antrenman tipinize uygun raunt planını seçin"
                : "Select interval format for bag, pads or sparring"
            }
            actionLabel={language === "tr" ? "+ Özel Sayaç" : "+ Custom"}
            onAction={() => setShowCreateModal(true)}
          />

          {/* Jabb-Style Presets with Round Badges (RN) */}
          <View className="gap-3 mb-6">
            {presets.map((preset) => {
              const isSelected = preset.id === activePreset?.id;
              const isCustom =
                !preset.id.startsWith("b-pre-") || preset.id.startsWith("b-pre-17");

              return (
                <Pressable
                  key={preset.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedPresetId(preset.id);
                  }}
                  className={`rounded-3xl p-4 flex-row items-center justify-between border transition-all ${
                    isSelected
                      ? "bg-[#181820] border-crimson/50"
                      : "bg-[#131317] border-surfaceBorder/80 active:bg-surfaceHover"
                  }`}
                >
                  <View className="flex-row items-center flex-1 mr-3">
                    {/* Jabb Round Square Badge (RN) */}
                    <View
                      className={`h-12 w-12 rounded-2xl items-center justify-center mr-3.5 border ${
                        isSelected
                          ? "bg-crimson/20 border-crimson/40"
                          : "bg-surfaceHover border-surfaceBorder"
                      }`}
                    >
                      <Text
                        className={`text-sm font-black tracking-tight ${
                          isSelected ? "text-crimson" : "text-textSecondary"
                        }`}
                      >
                        {preset.rounds}R
                      </Text>
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center gap-1.5">
                        <Text
                          className={`text-sm font-black ${
                            isSelected ? "text-white" : "text-textPrimary"
                          }`}
                          numberOfLines={1}
                        >
                          {preset.name}
                        </Text>
                      </View>
                      <Text className="text-xs text-textSecondary mt-0.5">
                        {formatTime(preset.workSeconds)} {language === "tr" ? "dövüş" : "work"} •{" "}
                        {preset.restSeconds}s {language === "tr" ? "dinlenme" : "rest"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2">
                    {isCustom && (
                      <Pressable
                        onPress={() => handleDeletePreset(preset)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        className="h-10 w-10 items-center justify-center rounded-xl bg-surface border border-surfaceBorder active:opacity-70"
                      >
                        <Ionicons name="trash-outline" size={16} color="#FF453A" />
                      </Pressable>
                    )}

                    <Pressable
                      onPress={() => handleLaunchTimer(preset)}
                      className={`h-10 px-4 rounded-xl items-center justify-center flex-row gap-1 ${
                        isSelected
                          ? "bg-crimson active:bg-crimsonDark"
                          : "bg-surfaceHover active:bg-surfaceBorder border border-surfaceBorder"
                      }`}
                    >
                      <Ionicons
                        name="play"
                        size={14}
                        color={isSelected ? "#FFFFFF" : "#F4F4F6"}
                      />
                      <Text
                        className={`text-xs font-black uppercase ${
                          isSelected ? "text-white" : "text-textPrimary"
                        }`}
                      >
                        {language === "tr" ? "BAŞLAT" : "START"}
                      </Text>
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}

            {/* Create Custom Timer Button */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowCreateModal(true);
              }}
              className="mt-1 h-13 rounded-2xl border border-dashed border-surfaceBorder/90 bg-[#121216] active:bg-[#1A1A22] items-center justify-center flex-row gap-2"
            >
              <Ionicons name="add-circle-outline" size={18} color="#D81E3C" />
              <Text className="text-xs font-black uppercase tracking-wider text-textPrimary">
                {language === "tr" ? "YENİ ÖZEL SAYAÇ OLUŞTUR" : "CREATE CUSTOM TIMER"}
              </Text>
            </Pressable>
          </View>

          {/* Coach's Corner Tip Card (Jabb-Style Advice) */}
          <View className="rounded-[24px] border border-surfaceBorder bg-[#141418] p-4 mb-6">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="h-6 w-6 rounded-lg bg-primary/20 items-center justify-center">
                <Ionicons name="bulb" size={14} color="#CCFF00" />
              </View>
              <Text className="text-[11px] font-black uppercase tracking-wider text-primary">
                {language === "tr" ? "KOÇUN KÖŞESİ" : "COACH'S CORNER"}
              </Text>
            </View>
            <Text className="text-xs font-medium text-textSecondary leading-relaxed italic">
              {language === "tr"
                ? "“Yumruk attıktan sonra elini asla aşağıda bırakma; fırlattığın çizgiden çenene geri çek. Ayak parmak uçlarında esnek kal.”"
                : "“Never drop your hands after throwing; snap it right back to your guard. Stay light on the balls of your feet.”"}
            </Text>
          </View>

          {/* Create Modal */}
          <CreateBoxingPresetModal
            visible={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSaved={loadPresets}
          />
        </View>
      )}

      {/* TAB 2: KOMBİNASYONLAR (Combos) */}
      {activeTab === "combos" && (
        <View className="gap-3.5 mb-6">
          <SectionHeader
            title={language === "tr" ? "Dövüş Kombinasyonları" : "Fight Combinations"}
            subtitle={
              language === "tr"
                ? "Gölge boksu ve torba için hazır koç serileri"
                : "Curated punch strings for bag and pad work"
            }
          />

          {[
            {
              name: language === "tr" ? "Klasik 1 - 2 Kombosu" : "Classic 1 - 2 String",
              level: language === "tr" ? "BAŞLANGIÇ" : "FOUNDATION",
              desc:
                language === "tr"
                  ? "Mesafe ayarlama ve ani arka el patlaması. Boks dünyasının en etkili temelidir."
                  : "Fundamental range finder and straight power cross finish.",
              steps: [
                { num: "1", name: "JAB", type: "lead" },
                { num: "2", name: "CROSS", type: "rear" },
              ],
            },
            {
              name: language === "tr" ? "Kroşe Kapanı (1 - 2 - 3)" : "Lead Hook Trap (1 - 2 - 3)",
              level: language === "tr" ? "ORTA SEVİYE" : "INTERMEDIATE",
              desc:
                language === "tr"
                  ? "Rakibin gardını öne çekip yan taraftan çeneye sol kroşeyi indirir."
                  : "Occupies the front guard and wraps a clean lead hook around the temple.",
              steps: [
                { num: "1", name: "JAB", type: "lead" },
                { num: "2", name: "CROSS", type: "rear" },
                { num: "3", name: "HOOK", type: "lead" },
              ],
            },
            {
              name: language === "tr" ? "Gövde - Kafa Yıkımı" : "Body-Head Destruction",
              level: language === "tr" ? "İLERİ SEVİYE" : "ADVANCED",
              desc:
                language === "tr"
                  ? "Eskiş ile seviye değiştirerek karaciğere aparkat ve ardından kafa kroşesi."
                  : "Slip off center, blast the liver with rear uppercut, return upstairs with lead hook.",
              steps: [
                { num: "1", name: "JAB", type: "lead" },
                { num: "SLIP", name: "ESKİŞ", type: "def" },
                { num: "6", name: "APARKAT", type: "rear" },
                { num: "3", name: "KROŞE", type: "lead" },
              ],
            },
            {
              name: language === "tr" ? "Geri Adım & Sayaç (Check Hook)" : "Check Hook & Pivot",
              level: language === "tr" ? "TAKTIK" : "TACTICAL",
              desc:
                language === "tr"
                  ? "Üzerinize gelen saldırgana karşı ön ayağı 90° çevirip sola çıkarak sol kroşe."
                  : "Pivot 90° off the front foot to escape aggression while landing a lead hook.",
              steps: [
                { num: "1", name: "JAB", type: "lead" },
                { num: "PIVOT", name: "DÖNÜŞ", type: "def" },
                { num: "3", name: "CHECK HOOK", type: "lead" },
                { num: "2", name: "CROSS", type: "rear" },
              ],
            },
          ].map((combo, idx) => (
            <View
              key={idx}
              className="rounded-3xl border border-surfaceBorder bg-[#141419] p-4"
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-base font-black text-textPrimary">
                  {combo.name}
                </Text>
                <View className="rounded-full bg-crimson/15 border border-crimson/30 px-2 py-0.5">
                  <Text className="text-[9px] font-black uppercase text-crimson">
                    {combo.level}
                  </Text>
                </View>
              </View>

              <Text className="text-xs text-textSecondary leading-relaxed mb-3">
                {combo.desc}
              </Text>

              {/* Sequence Badges */}
              <View className="flex-row flex-wrap items-center gap-2">
                {combo.steps.map((st, sIdx) => {
                  const isLead = st.type === "lead";
                  const isRear = st.type === "rear";

                  const badgeBg = isLead
                    ? "bg-sky-500/15 border-sky-500/30 text-sky-400"
                    : isRear
                    ? "bg-crimson/15 border-crimson/30 text-crimson"
                    : "bg-amber-500/15 border-amber-500/30 text-amber-400";

                  return (
                    <View key={sIdx} className="flex-row items-center gap-1.5">
                      <View
                        className={`rounded-xl border px-3 py-1.5 flex-row items-center gap-1.5 ${badgeBg}`}
                      >
                        <Text className="text-xs font-black font-mono">{st.num}</Text>
                        <Text className="text-[11px] font-extrabold uppercase">{st.name}</Text>
                      </View>
                      {sIdx < combo.steps.length - 1 && (
                        <Ionicons name="chevron-forward" size={12} color="#6B6B78" />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* TAB 3: VURUŞLAR & TEKNİK (Arsenal) */}
      {activeTab === "techniques" && (
        <View className="gap-3.5 mb-6">
          <SectionHeader
            title={language === "tr" ? "Temel Yumruk Numaraları" : "Punch Numbers (#1 - #6)"}
            subtitle={
              language === "tr"
                ? "Evrensel boks numaralandırma sistemi"
                : "Universal fight numbering standard"
            }
          />

          {[
            {
              num: "#1",
              name: "Sol Direkt / Jab",
              hand: language === "tr" ? "Ön El" : "Lead Hand",
              cue:
                language === "tr"
                  ? "Omuzu çeneye yapıştır, yumruğu hızla fırlatıp geri çek. Avuç içi yere baksın."
                  : "Snap straight out, rotate palm down, chin tucked against shoulder.",
            },
            {
              num: "#2",
              name: "Sağ Direkt / Cross",
              hand: language === "tr" ? "Arka Güç Eli" : "Rear Hand",
              cue:
                language === "tr"
                  ? "Arka ayağın parmak ucunda kalçayı çevir, tüm vücut ağırlığını yumruğa aktar."
                  : "Drive off back foot, rotate hip, full extension for maximum stopping power.",
            },
            {
              num: "#3",
              name: "Sol Kroşe / Lead Hook",
              hand: language === "tr" ? "Ön El" : "Lead Hand",
              cue:
                language === "tr"
                  ? "Ön ayağı 90° pivot yap, dirsek yumrukla aynı yatay eksende olsun."
                  : "Pivot lead foot 90°, elbow horizontal with fist, rotate the core.",
            },
            {
              num: "#4",
              name: "Sağ Kroşe / Rear Hook",
              hand: language === "tr" ? "Arka El" : "Rear Hand",
              cue:
                language === "tr"
                  ? "Arka ayağı çevirerek geniş ve sert bir yayla rakibin sol şakağına vur."
                  : "Powerful rear-side arc wrapping around the opponent's guard.",
            },
            {
              num: "#5",
              name: "Sol Aparkat / Lead Uppercut",
              hand: language === "tr" ? "Ön El" : "Lead Hand",
              cue:
                language === "tr"
                  ? "Dizleri hafif kırıp yukarıya doğru patlayıcı kuvvet üret, rakip gardının arasından vur."
                  : "Dip front shoulder slightly, drive upwards through guard into chin.",
            },
            {
              num: "#6",
              name: "Sağ Aparkat / Rear Uppercut",
              hand: language === "tr" ? "Güç Eli" : "Power Hand",
              cue:
                language === "tr"
                  ? "Kalçayı yukarı patlatarak çeneye veya karaciğere dik kuvvet uygula."
                  : "Explosive upward hip extension delivering power vertically.",
            },
          ].map((item) => (
            <View
              key={item.num}
              className="rounded-3xl border border-surfaceBorder bg-[#141419] p-4 flex-row items-start gap-3.5"
            >
              <View className="h-11 w-11 rounded-2xl bg-crimson/15 border border-crimson/30 items-center justify-center">
                <Text className="text-base font-black font-mono text-crimson">{item.num}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-sm font-black text-textPrimary">{item.name}</Text>
                  <Text className="text-[10px] font-bold text-textSecondary uppercase">
                    {item.hand}
                  </Text>
                </View>
                <Text className="text-xs text-textSecondary leading-relaxed">{item.cue}</Text>
              </View>
            </View>
          ))}

          <SectionHeader
            title={language === "tr" ? "Savunma & Kaçışlar" : "Defense & Movement"}
            subtitle={
              language === "tr"
                ? "Vurulmamak boksun yarısıdır"
                : "Defensive systems & slipping mechanics"
            }
          />

          {[
            {
              name: language === "tr" ? "Eskiş (Slip)" : "Slip (Inside & Outside)",
              desc:
                language === "tr"
                  ? "Bel ve dizlerden hafif bükülerek yumruk çizgisinin sadece birkaç santim dışına çıkın."
                  : "Bend at waist and knees off the center line just enough to let punches breeze past.",
            },
            {
              name: language === "tr" ? "Roll / Bob & Weave" : "Bob & Weave (Roll)",
              desc:
                language === "tr"
                  ? "U harfi çizerek kroşenin altından kayıp ters taraftan karşı saldırı pozisyonu alın."
                  : "Underhand dip in a U-shape under incoming hooks to counter-strike.",
            },
            {
              name: language === "tr" ? "Yüksek Gard Blok (High Guard)" : "High Guard Absorption",
              desc:
                language === "tr"
                  ? "Eldivenler şakaklara yapışık, dirsekler göğsü ve çeneyi kalkan gibi kilitler."
                  : "Gloves glued to temples, elbows tight, absorb impact through the forearms.",
            },
          ].map((def) => (
            <View
              key={def.name}
              className="rounded-3xl border border-surfaceBorder bg-[#141419] p-4"
            >
              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="shield-checkmark" size={16} color="#38BDF8" />
                <Text className="text-sm font-black text-textPrimary">{def.name}</Text>
              </View>
              <Text className="text-xs text-textSecondary leading-relaxed">{def.desc}</Text>
            </View>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
