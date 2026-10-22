import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/context/LanguageContext";
import { useAlert } from "@/context/AlertModalContext";
import { useDatabase } from "@/db/useDatabase";

interface CreateBoxingPresetModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function CreateBoxingPresetModal({
  visible,
  onClose,
  onSaved,
}: CreateBoxingPresetModalProps): React.JSX.Element {
  const { boxing: boxingRepo } = useDatabase();
  const { language } = useLanguage();
  const { showAlert } = useAlert();

  const [name, setName] = useState<string>("");
  const [rounds, setRounds] = useState<number>(6);
  const [workMinutes, setWorkMinutes] = useState<number>(3);
  const [workSeconds, setWorkSeconds] = useState<number>(0);
  const [restSeconds, setRestSeconds] = useState<number>(60);
  const [prepSeconds, setPrepSeconds] = useState<number>(10);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);

  const totalWorkSeconds = workMinutes * 60 + workSeconds;

  const handleUpdateRounds = (delta: number) => {
    setRounds((prev) => Math.max(1, Math.min(30, prev + delta)));
  };

  const handleUpdateWorkMinutes = (delta: number) => {
    setWorkMinutes((prev) => Math.max(0, Math.min(15, prev + delta)));
  };

  const handleUpdateWorkSeconds = (delta: number) => {
    setWorkSeconds((prev) => {
      const next = prev + delta;
      if (next >= 60) return 0;
      if (next < 0) return 45;
      return next;
    });
  };

  const handleUpdateRestSeconds = (delta: number) => {
    setRestSeconds((prev) => Math.max(10, Math.min(300, prev + delta)));
  };

  const handleUpdatePrepSeconds = (delta: number) => {
    setPrepSeconds((prev) => Math.max(3, Math.min(60, prev + delta)));
  };

  const handleSave = async () => {
    const trimmedName =
      name.trim() ||
      (language === "tr"
        ? `${rounds} Raunt Özel Sayaç`
        : `${rounds} Rounds Custom Timer`);

    if (totalWorkSeconds <= 0) {
      showAlert({
        title: language === "tr" ? "Geçersiz Süre" : "Invalid Duration",
        message:
          language === "tr"
            ? "Çalışma / Dövüş süresi 0'dan büyük olmalıdır."
            : "Work duration must be greater than 0.",
        type: "warning",
      });
      return;
    }

    try {
      await boxingRepo.savePreset({
        name: trimmedName,
        rounds,
        workSeconds: totalWorkSeconds,
        restSeconds,
        prepSeconds,
        soundEnabled: true,
        hapticsEnabled,
      });

      onSaved();
      onClose();
      setName("");
    } catch (err: any) {
      showAlert({
        title: language === "tr" ? "Hata" : "Error",
        message: err.message || "Failed to save preset",
        type: "danger",
      });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/85"
      >
        <View className="max-h-[92%] rounded-t-3xl border-t border-surfaceBorder bg-background p-5 pb-9">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-[10px] font-black uppercase tracking-widest text-primary">
                {language === "tr" ? "ÖZEL BOKS SAYACI" : "CUSTOM BOXING TIMER"}
              </Text>
              <Text className="text-2xl font-black text-textPrimary">
                {language === "tr" ? "Yeni Sayaç Oluştur" : "Create Timer Preset"}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="h-9 w-9 items-center justify-center rounded-full bg-surface border border-surfaceBorder"
            >
              <Ionicons name="close" size={18} color="#F4F4F6" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Preset Name */}
            <View className="mb-4">
              <Text className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mb-1.5">
                {language === "tr" ? "Program / Sayaç Adı" : "Preset Name"}
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={
                  language === "tr"
                    ? "Örn: 8 Raunt Yoğun Kum Torbası"
                    : "e.g. 8 Rounds Heavy Bag HIIT"
                }
                placeholderTextColor="#6B6B78"
                className="h-12 rounded-xl bg-surface border border-surfaceBorder px-4 text-sm font-bold text-textPrimary"
              />
            </View>

            {/* Total Rounds Control */}
            <Card className="p-4 mb-3 bg-surface border border-surfaceBorder">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-xs font-bold uppercase tracking-wider text-textSecondary">
                    {language === "tr" ? "Toplam Raunt Sayısı" : "Total Rounds"}
                  </Text>
                  <Text className="text-[11px] text-textMuted mt-0.5">
                    {language === "tr" ? "1 ile 30 raunt arası" : "Between 1 and 30 rounds"}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Pressable
                    onPress={() => handleUpdateRounds(-1)}
                    className="h-10 w-10 rounded-xl bg-surfaceHover items-center justify-center border border-surfaceBorder active:opacity-70"
                  >
                    <Ionicons name="remove" size={18} color="#F4F4F6" />
                  </Pressable>
                  <Text className="mx-4 text-2xl font-black font-mono text-primary">
                    {rounds}
                  </Text>
                  <Pressable
                    onPress={() => handleUpdateRounds(1)}
                    className="h-10 w-10 rounded-xl bg-surfaceHover items-center justify-center border border-surfaceBorder active:opacity-70"
                  >
                    <Ionicons name="add" size={18} color="#F4F4F6" />
                  </Pressable>
                </View>
              </View>
            </Card>

            {/* Work Duration Control */}
            <Card className="p-4 mb-3 bg-surface border border-surfaceBorder">
              <Text className="text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
                {language === "tr" ? "Dövüş / Çalışma Süresi (Raunt Başına)" : "Work Duration (Per Round)"}
              </Text>

              <View className="flex-row items-center justify-between">
                {/* Minutes */}
                <View className="flex-row items-center">
                  <Pressable
                    onPress={() => handleUpdateWorkMinutes(-1)}
                    className="h-9 w-9 rounded-lg bg-surfaceHover items-center justify-center border border-surfaceBorder"
                  >
                    <Ionicons name="remove" size={16} color="#F4F4F6" />
                  </Pressable>
                  <Text className="mx-3 text-xl font-black font-mono text-textPrimary">
                    {workMinutes} <Text className="text-xs text-textMuted font-bold">dk</Text>
                  </Text>
                  <Pressable
                    onPress={() => handleUpdateWorkMinutes(1)}
                    className="h-9 w-9 rounded-lg bg-surfaceHover items-center justify-center border border-surfaceBorder"
                  >
                    <Ionicons name="add" size={16} color="#F4F4F6" />
                  </Pressable>
                </View>

                {/* Seconds */}
                <View className="flex-row items-center">
                  <Pressable
                    onPress={() => handleUpdateWorkSeconds(-15)}
                    className="h-9 w-9 rounded-lg bg-surfaceHover items-center justify-center border border-surfaceBorder"
                  >
                    <Ionicons name="remove" size={16} color="#F4F4F6" />
                  </Pressable>
                  <Text className="mx-3 text-xl font-black font-mono text-textPrimary">
                    {workSeconds.toString().padStart(2, "0")} <Text className="text-xs text-textMuted font-bold">sn</Text>
                  </Text>
                  <Pressable
                    onPress={() => handleUpdateWorkSeconds(15)}
                    className="h-9 w-9 rounded-lg bg-surfaceHover items-center justify-center border border-surfaceBorder"
                  >
                    <Ionicons name="add" size={16} color="#F4F4F6" />
                  </Pressable>
                </View>
              </View>

              {/* Quick Pills */}
              <View className="flex-row gap-1.5 mt-3 pt-2.5 border-t border-surfaceBorder">
                {[
                  { label: "1:00", m: 1, s: 0 },
                  { label: "2:00", m: 2, s: 0 },
                  { label: "3:00", m: 3, s: 0 },
                  { label: "5:00", m: 5, s: 0 },
                ].map((item) => (
                  <Pressable
                    key={item.label}
                    onPress={() => {
                      setWorkMinutes(item.m);
                      setWorkSeconds(item.s);
                    }}
                    className={`flex-1 py-1.5 rounded-lg items-center border ${
                      workMinutes === item.m && workSeconds === item.s
                        ? "bg-primary border-primary"
                        : "bg-surfaceHover border-surfaceBorder"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        workMinutes === item.m && workSeconds === item.s
                          ? "text-black"
                          : "text-textSecondary"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Card>

            {/* Rest Duration Control */}
            <Card className="p-4 mb-3 bg-surface border border-surfaceBorder">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-bold uppercase tracking-wider text-textSecondary">
                  {language === "tr" ? "Dinlenme Süresi" : "Rest Duration"}
                </Text>
                <Text className="text-sm font-mono font-bold text-blue-400">
                  {restSeconds} sn
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Pressable
                  onPress={() => handleUpdateRestSeconds(-15)}
                  className="h-9 w-9 rounded-lg bg-surfaceHover items-center justify-center border border-surfaceBorder"
                >
                  <Ionicons name="remove" size={16} color="#F4F4F6" />
                </Pressable>

                {/* Quick Pills for Rest */}
                <View className="flex-row flex-1 mx-2 gap-1.5">
                  {[15, 30, 45, 60, 90].map((s) => (
                    <Pressable
                      key={s}
                      onPress={() => setRestSeconds(s)}
                      className={`flex-1 py-1.5 rounded-lg items-center border ${
                        restSeconds === s
                          ? "bg-blue-500 border-blue-400"
                          : "bg-surfaceHover border-surfaceBorder"
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          restSeconds === s ? "text-white" : "text-textSecondary"
                        }`}
                      >
                        {s}s
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable
                  onPress={() => handleUpdateRestSeconds(15)}
                  className="h-9 w-9 rounded-lg bg-surfaceHover items-center justify-center border border-surfaceBorder"
                >
                  <Ionicons name="add" size={16} color="#F4F4F6" />
                </Pressable>
              </View>
            </Card>

            {/* Prepared Time (Countdown) */}
            <Card className="p-4 mb-4 bg-surface border border-surfaceBorder">
              <View className="flex-row items-center justify-between mb-2">
                <View>
                  <Text className="text-xs font-bold uppercase tracking-wider text-textSecondary">
                    {language === "tr" ? "Hazırlık Geri Sayımı (Prep Time)" : "Preparation Countdown"}
                  </Text>
                  <Text className="text-[11px] text-textMuted">
                    {language === "tr" ? "İlk raunt başlamadan önceki süre" : "Countdown before round 1 begins"}
                  </Text>
                </View>
                <Text className="text-sm font-mono font-bold text-gold">
                  {prepSeconds} sn
                </Text>
              </View>

              <View className="flex-row gap-2 mt-1">
                {[5, 10, 15, 20].map((ps) => (
                  <Pressable
                    key={ps}
                    onPress={() => setPrepSeconds(ps)}
                    className={`flex-1 py-1.5 rounded-lg items-center border ${
                      prepSeconds === ps
                        ? "bg-gold border-gold"
                        : "bg-surfaceHover border-surfaceBorder"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        prepSeconds === ps ? "text-black" : "text-textSecondary"
                      }`}
                    >
                      {ps}s
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Card>

            {/* Vibration & Haptics Toggle */}
            <Pressable
              onPress={() => setHapticsEnabled(!hapticsEnabled)}
              className="flex-row items-center justify-between p-3.5 rounded-xl bg-surface border border-surfaceBorder mb-4"
            >
              <View className="flex-row items-center">
                <Ionicons
                  name={hapticsEnabled ? "phone-portrait" : "phone-portrait-outline"}
                  size={18}
                  color={hapticsEnabled ? "#CCFF00" : "#6B6B78"}
                />
                <Text className="ml-2.5 text-xs font-bold text-textPrimary">
                  {language === "tr" ? "Titreşim & Haptik Geri Bildirim" : "Vibration & Haptics Feedback"}
                </Text>
              </View>
              <View
                className={`h-6 w-11 rounded-full p-0.5 justify-center ${
                  hapticsEnabled ? "bg-primary" : "bg-surfaceHover border border-surfaceBorder"
                }`}
              >
                <View
                  className={`h-5 w-5 rounded-full ${
                    hapticsEnabled ? "bg-black self-end" : "bg-textMuted self-start"
                  }`}
                />
              </View>
            </Pressable>

            {/* Submit Button */}
            <Button
              title={language === "tr" ? "SAYACI KAYDET" : "SAVE TIMER PRESET"}
              onPress={handleSave}
              size="lg"
              className="mt-1"
              icon={<Ionicons name="checkmark-sharp" size={20} color="#000" />}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
