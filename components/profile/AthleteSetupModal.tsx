import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/context/LanguageContext";
import { useDatabase } from "@/db/useDatabase";
import { AthleteProfile } from "@/db/schema";

interface AthleteSetupModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialProfile?: AthleteProfile | null;
  isFirstTime?: boolean;
}

export function AthleteSetupModal({
  visible,
  onClose,
  onSaved,
  initialProfile,
  isFirstTime = false,
}: AthleteSetupModalProps): React.JSX.Element {
  const { profile: profileRepo } = useDatabase();
  const { language } = useLanguage();

  const [name, setName] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [sex, setSex] = useState<string>("male"); // male, female, other

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.displayName || "");
      setHeight(initialProfile.height ? String(initialProfile.height) : "");
      setWeight(initialProfile.currentWeight ? String(initialProfile.currentWeight) : "");
      setAge(initialProfile.age ? String(initialProfile.age) : "");
      setSex(initialProfile.sex || "male");
    } else {
      setName("");
      setHeight("");
      setWeight("");
      setAge("");
      setSex("male");
    }
  }, [initialProfile, visible]);

  // Live BMI Preview
  const heightNum = parseFloat(height);
  const weightNum = parseFloat(weight);
  const bmiInfo =
    heightNum > 50 && weightNum > 20
      ? profileRepo.calculateBMI(weightNum, heightNum)
      : null;

  const handleSave = async () => {
    const trimmedName = name.trim() || (language === "tr" ? "Demir Sporcu" : "Iron Athlete");
    const parsedHeight = parseFloat(height);
    const parsedWeight = parseFloat(weight);
    const parsedAge = parseInt(age, 10);

    if (!parsedHeight || parsedHeight < 80 || parsedHeight > 260) {
      Alert.alert(
        language === "tr" ? "Geçersiz Boy" : "Invalid Height",
        language === "tr"
          ? "Lütfen geçerli bir boy giriniz (80 - 260 cm)."
          : "Please enter a valid height (80 - 260 cm)."
      );
      return;
    }

    if (!parsedWeight || parsedWeight < 25 || parsedWeight > 350) {
      Alert.alert(
        language === "tr" ? "Geçersiz Kilo" : "Invalid Weight",
        language === "tr"
          ? "Lütfen geçerli bir kilo giriniz (25 - 350 kg)."
          : "Please enter a valid weight (25 - 350 kg)."
      );
      return;
    }

    try {
      await profileRepo.saveProfile({
        displayName: trimmedName,
        height: parsedHeight,
        currentWeight: parsedWeight,
        age: parsedAge > 0 ? parsedAge : 25,
        sex,
        preferredWeightUnit: "kg",
        preferredDistanceUnit: "cm",
      });

      onSaved();
      onClose();
    } catch (err: any) {
      Alert.alert(
        language === "tr" ? "Hata" : "Error",
        err.message || "Profil kaydedilemedi."
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={isFirstTime ? () => {} : onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/80"
      >
        <View className="max-h-[90%] rounded-t-3xl border-t border-surfaceBorder bg-background p-5 pb-9">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1 mr-3">
              <Text className="text-[10px] font-black uppercase tracking-widest text-primary">
                {isFirstTime
                  ? language === "tr"
                    ? "HOŞ GELDİNİZ • İLK KURULUM"
                    : "WELCOME • ATHLETE SETUP"
                  : language === "tr"
                  ? "SPORCU PROFİLİ"
                  : "ATHLETE PROFILE"}
              </Text>
              <Text className="text-2xl font-black text-textPrimary">
                {isFirstTime
                  ? language === "tr"
                    ? "Bilgilerinizi Girin"
                    : "Enter Your Details"
                  : language === "tr"
                  ? "Profili Güncelle"
                  : "Update Profile"}
              </Text>
            </View>
            {!isFirstTime && (
              <Pressable
                onPress={onClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="h-9 w-9 items-center justify-center rounded-full bg-surface border border-surfaceBorder"
              >
                <Ionicons name="close" size={18} color="#F4F4F6" />
              </Pressable>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {isFirstTime && (
              <Text className="text-xs text-textSecondary mb-4 leading-relaxed">
                {language === "tr"
                  ? "IRONPULSE tamamen cihazınızda çalışır. Boy, kilo ve yaş bilgileriniz kişisel antrenman analizleriniz ve BMI hesaplamanız için yerel hafızada tutulur."
                  : "IRONPULSE runs 100% offline. Your biometrics are stored locally on your device for accurate tracking and BMI calculation."}
              </Text>
            )}

            {/* Name Input */}
            <View className="mb-3.5">
              <Text className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mb-1.5">
                {language === "tr" ? "Sporcu Adı / Lakap" : "Athlete Name / Nickname"}
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={language === "tr" ? "Örn: Yusuf" : "e.g. Alex"}
                placeholderTextColor="#6B6B78"
                className="h-12 rounded-xl bg-surface border border-surfaceBorder px-4 text-sm font-semibold text-textPrimary"
              />
            </View>

            {/* Height & Weight Inputs (side-by-side) */}
            <View className="flex-row gap-3 mb-3.5">
              <View className="flex-1">
                <Text className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mb-1.5">
                  {language === "tr" ? "Boy (cm)" : "Height (cm)"}
                </Text>
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                  placeholder="180"
                  placeholderTextColor="#6B6B78"
                  className="h-12 rounded-xl bg-surface border border-surfaceBorder px-4 text-base font-bold font-mono text-textPrimary"
                />
              </View>

              <View className="flex-1">
                <Text className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mb-1.5">
                  {language === "tr" ? "Kilo (kg)" : "Weight (kg)"}
                </Text>
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholder="80.0"
                  placeholderTextColor="#6B6B78"
                  className="h-12 rounded-xl bg-surface border border-surfaceBorder px-4 text-base font-bold font-mono text-textPrimary"
                />
              </View>
            </View>

            {/* Age & Sex Inputs */}
            <View className="flex-row gap-3 mb-4">
              <View className="w-28">
                <Text className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mb-1.5">
                  {language === "tr" ? "Yaş" : "Age"}
                </Text>
                <TextInput
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholder="24"
                  placeholderTextColor="#6B6B78"
                  className="h-12 rounded-xl bg-surface border border-surfaceBorder px-4 text-base font-bold font-mono text-textPrimary"
                />
              </View>

              <View className="flex-1">
                <Text className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mb-1.5">
                  {language === "tr" ? "Cinsiyet" : "Sex"}
                </Text>
                <View className="flex-row gap-1.5">
                  {[
                    { key: "male", label: language === "tr" ? "Erkek" : "Male" },
                    { key: "female", label: language === "tr" ? "Kadın" : "Female" },
                    { key: "other", label: language === "tr" ? "Diğer" : "Other" },
                  ].map((item) => (
                    <Pressable
                      key={item.key}
                      onPress={() => setSex(item.key)}
                      className={`flex-1 h-12 items-center justify-center rounded-xl border ${
                        sex === item.key
                          ? "bg-primary border-primary"
                          : "bg-surface border-surfaceBorder"
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          sex === item.key ? "text-black" : "text-textSecondary"
                        }`}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {/* Live BMI Preview Card */}
            {bmiInfo && (
              <Card variant="highlight" className="p-3.5 mb-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-[10px] font-black uppercase tracking-wider text-primary">
                      {language === "tr" ? "HESAPLANAN BMI (VKİ)" : "CALCULATED BMI"}
                    </Text>
                    <Text className="text-xl font-black text-textPrimary">
                      {bmiInfo.bmi}{" "}
                      <Text className="text-xs font-bold text-textSecondary">
                        • {bmiInfo.category}
                      </Text>
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[10px] text-textMuted uppercase">
                      {language === "tr" ? "İdeal Aralık" : "Healthy Range"}
                    </Text>
                    <Text className="text-xs font-bold font-mono text-gold">
                      {bmiInfo.healthyWeightRange.min} - {bmiInfo.healthyWeightRange.max} kg
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            {/* Submit Button */}
            <Button
              title={
                isFirstTime
                  ? language === "tr"
                    ? "BAŞLA VE KAYDET"
                    : "GET STARTED"
                  : language === "tr"
                  ? "BİLGİLERİ GÜNCELLE"
                  : "SAVE CHANGES"
              }
              onPress={handleSave}
              size="lg"
              className="mt-2"
              icon={<Ionicons name="checkmark-sharp" size={20} color="#000" />}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
