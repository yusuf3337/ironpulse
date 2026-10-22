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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  EXERCISE_CATALOG,
  MUSCLE_GROUPS,
  EQUIPMENT_TYPES,
  CatalogExercise,
} from "@/constants/exerciseCatalog";
import { useLanguage } from "@/context/LanguageContext";
import { useAlert } from "@/context/AlertModalContext";
import { useDatabase } from "@/db/useDatabase";
import { DayRoutine } from "@/db/repositories/programRepo";

interface SelectedExerciseItem {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: string;
}

interface CustomizeDayModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  weekday: string;
  weekdayLabel: string;
  initialRoutine?: DayRoutine | null;
}

export function CustomizeDayModal({
  visible,
  onClose,
  onSaved,
  weekday,
  weekdayLabel,
  initialRoutine,
}: CustomizeDayModalProps): React.JSX.Element {
  const { programs: programRepo } = useDatabase();
  const { language } = useLanguage();
  const { showAlert } = useAlert();

  const [title, setTitle] = useState<string>("");
  const [isRest, setIsRest] = useState<boolean>(false);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExerciseItem[]>([]);

  // Exercise Picker Drawer View
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("Tümü");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("Tümü");

  useEffect(() => {
    if (initialRoutine) {
      setTitle(initialRoutine.title || "");
      setIsRest(Boolean(initialRoutine.isRest));
      setSelectedExercises(
        initialRoutine.exercises.map((e) => ({
          exerciseId: e.exerciseId,
          exerciseName: e.exerciseName,
          targetSets: e.targetSets || 3,
          targetReps: e.targetReps || "8-10",
        }))
      );
    } else {
      setTitle(isRest ? "Dinlenme Günü" : "Antrenman Günü");
      setIsRest(false);
      setSelectedExercises([]);
    }
  }, [initialRoutine, visible]);

  const handleToggleRest = (rest: boolean) => {
    setIsRest(rest);
    if (rest) {
      setTitle(language === "tr" ? "Dinlenme Günü" : "Rest Day");
    } else if (!title || title.includes("Dinlenme") || title.includes("Rest")) {
      setTitle(language === "tr" ? "Özel Antrenman" : "Custom Workout");
    }
  };

  const handleAddExerciseFromCatalog = (catalogEx: CatalogExercise) => {
    const alreadyExists = selectedExercises.some(
      (e) => e.exerciseId === catalogEx.id
    );
    if (alreadyExists) {
      showAlert({
        title: language === "tr" ? "Zaten Eklendi" : "Already Added",
        message:
          language === "tr"
            ? `${catalogEx.name} zaten bu günün listesinde mevcut.`
            : `${catalogEx.name} is already in this day's routine.`,
        type: "warning",
      });
      return;
    }

    setSelectedExercises((prev) => [
      ...prev,
      {
        exerciseId: catalogEx.id,
        exerciseName: catalogEx.name,
        targetSets: 3,
        targetReps: "8-10",
      },
    ]);
    setShowPicker(false);
    setSearchQuery("");
  };

  const handleRemoveExercise = (idx: number) => {
    setSelectedExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateSets = (idx: number, delta: number) => {
    setSelectedExercises((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const newSets = Math.max(1, Math.min(10, item.targetSets + delta));
        return { ...item, targetSets: newSets };
      })
    );
  };

  const handleUpdateReps = (idx: number, reps: string) => {
    setSelectedExercises((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, targetReps: reps } : item))
    );
  };

  const handleSave = async () => {
    const trimmedTitle =
      title.trim() ||
      (isRest
        ? language === "tr" ? "Dinlenme Günü" : "Rest Day"
        : language === "tr" ? "Özel Antrenman" : "Custom Workout");

    if (!isRest && selectedExercises.length === 0) {
      showAlert({
        title: language === "tr" ? "Hareket Seçilmedi" : "No Exercises Selected",
        message:
          language === "tr"
            ? "Lütfen bu gün için en az bir hareket ekleyin ya da günü 'Dinlenme Günü' olarak işaretleyin."
            : "Please select at least one exercise or mark this day as a rest day.",
        type: "warning",
      });
      return;
    }

    try {
      await programRepo.saveDayRoutine(
        weekday,
        trimmedTitle,
        isRest,
        isRest ? [] : selectedExercises
      );
      onSaved();
      onClose();
    } catch (err: any) {
      showAlert({
        title: language === "tr" ? "Hata" : "Error",
        message: err.message || "Failed to save routine",
        type: "danger",
      });
    }
  };

  // Filter exercises from catalog
  const filteredCatalog = EXERCISE_CATALOG.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMuscle =
      selectedMuscle === "Tümü" || ex.muscleGroup === selectedMuscle;

    const matchesEquipment =
      selectedEquipment === "Tümü" || ex.equipment === selectedEquipment;

    return matchesSearch && matchesMuscle && matchesEquipment;
  });

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
                {weekdayLabel} • {language === "tr" ? "GÜNÜ DÜZENLE" : "CUSTOMIZE DAY"}
              </Text>
              <Text className="text-2xl font-black text-textPrimary">
                {language === "tr" ? "Antrenmanını Belirle" : "Configure Routine"}
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

          {/* Day Type Toggle (Çalışma vs Dinlenme) */}
          <View className="flex-row rounded-xl bg-surface border border-surfaceBorder p-1 mb-4">
            <Pressable
              onPress={() => handleToggleRest(false)}
              className={`flex-1 py-2.5 items-center justify-center rounded-lg ${
                !isRest ? "bg-primary" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-xs font-black uppercase tracking-wider ${
                  !isRest ? "text-black" : "text-textSecondary"
                }`}
              >
                🏋️ {language === "tr" ? "Antrenman Günü" : "Workout Day"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleToggleRest(true)}
              className={`flex-1 py-2.5 items-center justify-center rounded-lg ${
                isRest ? "bg-surfaceHover border border-surfaceBorder" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-xs font-black uppercase tracking-wider ${
                  isRest ? "text-primary" : "text-textSecondary"
                }`}
              >
                💤 {language === "tr" ? "Dinlenme Günü" : "Rest Day"}
              </Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Title / Focus Input */}
            <View className="mb-4">
              <Text className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mb-1.5">
                {language === "tr" ? "Günün Odağı / Başlığı" : "Day Focus / Title"}
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder={
                  isRest
                    ? language === "tr" ? "Örn: Aktif Dinlenme & Esneme" : "e.g. Active Recovery"
                    : language === "tr" ? "Örn: Göğüs & Arka Kol veya İtiş" : "e.g. Chest & Triceps"
                }
                placeholderTextColor="#6B6B78"
                className="h-12 rounded-xl bg-surface border border-surfaceBorder px-4 text-sm font-bold text-textPrimary"
              />
            </View>

            {isRest ? (
              <Card className="p-4 mb-4 border-dashed border-surfaceBorder">
                <Text className="text-xs text-textSecondary leading-relaxed">
                  {language === "tr"
                    ? "Bu gün dinlenme olarak belirlendi. Kas liflerinin onarımı ve merkezi sinir sistemi toparlanması için antrenman yapılmayacaktır."
                    : "This day is set as a rest day. No exercises are required, allowing optimal physiological recovery."}
                </Text>
              </Card>
            ) : (
              <View className="mb-4">
                {/* Exercises List Header */}
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-xs font-bold uppercase tracking-wider text-textSecondary">
                    {language === "tr" ? "GÜNÜN HAREKETLERİ" : "DAY EXERCISES"} ({selectedExercises.length})
                  </Text>
                  <Pressable
                    onPress={() => setShowPicker(true)}
                    className="flex-row items-center py-1 px-2.5 rounded-lg bg-primary/10 border border-primary/30"
                  >
                    <Ionicons name="add" size={14} color="#CCFF00" />
                    <Text className="ml-1 text-xs font-bold text-primary">
                      {language === "tr" ? "+ HAREKET EKLE" : "+ ADD EXERCISE"}
                    </Text>
                  </Pressable>
                </View>

                {/* Selected Exercise Cards */}
                {selectedExercises.length > 0 ? (
                  <View className="gap-2.5">
                    {selectedExercises.map((item, idx) => (
                      <Card key={idx} className="p-3 bg-surface border border-surfaceBorder">
                        <View className="flex-row items-center justify-between mb-2">
                          <View className="flex-1 mr-2">
                            <Text className="text-sm font-bold text-textPrimary">
                              {idx + 1}. {item.exerciseName}
                            </Text>
                          </View>
                          <Pressable
                            onPress={() => handleRemoveExercise(idx)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            className="p-1"
                          >
                            <Ionicons name="trash-outline" size={16} color="#EF4444" />
                          </Pressable>
                        </View>

                        {/* Sets & Reps Config Row */}
                        <View className="flex-row items-center justify-between border-t border-surfaceBorder pt-2">
                          {/* Sets Counter */}
                          <View className="flex-row items-center">
                            <Text className="text-[11px] font-bold text-textSecondary mr-2 uppercase">
                              Set:
                            </Text>
                            <Pressable
                              onPress={() => handleUpdateSets(idx, -1)}
                              className="h-7 w-7 rounded-md bg-surfaceHover items-center justify-center border border-surfaceBorder"
                            >
                              <Ionicons name="remove" size={14} color="#F4F4F6" />
                            </Pressable>
                            <Text className="mx-2.5 text-sm font-black font-mono text-textPrimary">
                              {item.targetSets}
                            </Text>
                            <Pressable
                              onPress={() => handleUpdateSets(idx, 1)}
                              className="h-7 w-7 rounded-md bg-surfaceHover items-center justify-center border border-surfaceBorder"
                            >
                              <Ionicons name="add" size={14} color="#F4F4F6" />
                            </Pressable>
                          </View>

                          {/* Reps Quick Selector */}
                          <View className="flex-row items-center">
                            <Text className="text-[11px] font-bold text-textSecondary mr-1.5 uppercase">
                              Tekrar:
                            </Text>
                            <TextInput
                              value={item.targetReps}
                              onChangeText={(val) => handleUpdateReps(idx, val)}
                              className="h-7 px-2 rounded-md bg-surfaceHover border border-surfaceBorder text-xs font-mono font-bold text-primary text-center min-w-[50px]"
                            />
                          </View>
                        </View>
                      </Card>
                    ))}
                  </View>
                ) : (
                  <Pressable
                    onPress={() => setShowPicker(true)}
                    className="items-center justify-center p-6 rounded-2xl border border-dashed border-surfaceBorder bg-surface/30"
                  >
                    <Ionicons name="barbell-outline" size={28} color="#6B6B78" />
                    <Text className="mt-2 text-sm font-bold text-textPrimary">
                      {language === "tr" ? "Henüz hareket eklenmedi" : "No exercises added"}
                    </Text>
                    <Text className="text-xs text-textSecondary mt-0.5 text-center">
                      {language === "tr"
                        ? "Hazır kütüphaneden hareket seçmek için buraya dokunun"
                        : "Tap here to pick exercises from the categorized catalog"}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* Save Button */}
            <Button
              title={language === "tr" ? "PROGRAMI KAYDET" : "SAVE ROUTINE"}
              onPress={handleSave}
              size="lg"
              className="mt-2"
              icon={<Ionicons name="checkmark-sharp" size={20} color="#000" />}
            />
          </ScrollView>
        </View>

        {/* Nested Exercise Picker Modal */}
        <Modal
          visible={showPicker}
          animationType="slide"
          transparent
          onRequestClose={() => setShowPicker(false)}
        >
          <View className="flex-1 bg-background pt-12 px-4 justify-between pb-8">
            {/* Picker Header */}
            <View className="flex-row items-center justify-between pb-3 border-b border-surfaceBorder">
              <View>
                <Text className="text-[10px] font-black uppercase tracking-widest text-primary">
                  {language === "tr" ? "HAZIR KÜTÜPHANE" : "EXERCISE CATALOG"}
                </Text>
                <Text className="text-xl font-black text-textPrimary">
                  {language === "tr" ? "Hareket Seç" : "Select Exercise"}
                </Text>
              </View>
              <Pressable
                onPress={() => setShowPicker(false)}
                className="h-9 w-9 items-center justify-center rounded-full bg-surface border border-surfaceBorder"
              >
                <Ionicons name="close" size={18} color="#F4F4F6" />
              </Pressable>
            </View>

            {/* Search Input */}
            <View className="my-3">
              <View className="flex-row items-center h-11 rounded-xl bg-surface border border-surfaceBorder px-3">
                <Ionicons name="search" size={16} color="#6B6B78" />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={language === "tr" ? "Hareket, bölge veya ekipman ara..." : "Search exercises..."}
                  placeholderTextColor="#6B6B78"
                  className="flex-1 ml-2 text-sm text-textPrimary font-semibold"
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={16} color="#6B6B78" />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Muscle Group Horizontal Filter */}
            <View className="mb-2">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: "row", gap: 8, paddingRight: 16 }}
              >
                {MUSCLE_GROUPS.map((mg) => (
                  <Pressable
                    key={mg}
                    onPress={() => setSelectedMuscle(mg)}
                    className={`px-3.5 py-1.5 rounded-full border ${
                      selectedMuscle === mg
                        ? "bg-primary border-primary"
                        : "bg-surface border-surfaceBorder"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        selectedMuscle === mg ? "text-black" : "text-textSecondary"
                      }`}
                    >
                      {mg}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Equipment Filter Chips */}
            <View className="mb-3">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: "row", gap: 6, paddingRight: 16 }}
              >
                {EQUIPMENT_TYPES.map((eq) => (
                  <Pressable
                    key={eq}
                    onPress={() => setSelectedEquipment(eq)}
                    className={`px-3 py-1 rounded-lg border ${
                      selectedEquipment === eq
                        ? "bg-surfaceHover border-primary"
                        : "bg-surface/50 border-surfaceBorder/60"
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-bold ${
                        selectedEquipment === eq ? "text-primary" : "text-textMuted"
                      }`}
                    >
                      {eq}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Filtered Exercises List */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="gap-2 pb-6">
                {filteredCatalog.map((ex) => (
                  <Pressable
                    key={ex.id}
                    onPress={() => handleAddExerciseFromCatalog(ex)}
                    className="p-3.5 rounded-xl bg-surface border border-surfaceBorder active:bg-surfaceHover flex-row items-center justify-between"
                  >
                    <View className="flex-1 mr-2">
                      <Text className="text-sm font-bold text-textPrimary">
                        {ex.name}
                      </Text>
                      <View className="flex-row items-center gap-1.5 mt-1">
                        <View className="bg-primary/10 px-2 py-0.5 rounded">
                          <Text className="text-[10px] font-extrabold text-primary uppercase">
                            {ex.muscleGroup}
                          </Text>
                        </View>
                        <View className="bg-surfaceHover px-2 py-0.5 rounded border border-surfaceBorder">
                          <Text className="text-[10px] font-bold text-textSecondary">
                            {ex.equipment}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="add-circle-outline" size={22} color="#CCFF00" />
                  </Pressable>
                ))}

                {filteredCatalog.length === 0 && (
                  <View className="items-center py-12">
                    <Text className="text-sm font-bold text-textSecondary">
                      {language === "tr" ? "Sonuç bulunamadı" : "No exercises found"}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Modal>
  );
}
