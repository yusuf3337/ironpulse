import React, { createContext, useContext, useState, useCallback } from "react";
import { Modal, View, Text, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export type AlertType = "info" | "success" | "warning" | "danger";

export interface AlertOptions {
  title: string;
  message?: string;
  type?: AlertType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  showCancel?: boolean;
}

interface AlertModalContextType {
  showAlert: (options: AlertOptions) => void;
  showConfirm: (
    options: Omit<AlertOptions, "showCancel"> & { onConfirm: () => void | Promise<void> }
  ) => void;
  hideAlert: () => void;
}

const AlertModalContext = createContext<AlertModalContextType>({
  showAlert: () => {},
  showConfirm: () => {},
  hideAlert: () => {},
});

export function AlertModalProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [visible, setVisible] = useState<boolean>(false);
  const [config, setConfig] = useState<AlertOptions>({
    title: "",
    type: "info",
    confirmText: "Tamam",
    showCancel: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showAlert = useCallback((options: AlertOptions) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setConfig({
      type: "info",
      confirmText: "Tamam",
      showCancel: false,
      ...options,
    });
    setVisible(true);
  }, []);

  const showConfirm = useCallback(
    (options: Omit<AlertOptions, "showCancel"> & { onConfirm: () => void | Promise<void> }) => {
      Haptics.notificationAsync(
        options.type === "danger"
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success
      );
      setConfig({
        type: "warning",
        confirmText: "Onayla",
        cancelText: "Vazgeç",
        showCancel: true,
        ...options,
      });
      setVisible(true);
    },
    []
  );

  const hideAlert = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVisible(false);
    setIsLoading(false);
  }, []);

  const handleConfirm = async () => {
    if (config.onConfirm) {
      try {
        setIsLoading(true);
        await config.onConfirm();
      } catch (err) {
        console.error("Alert confirm action error:", err);
      } finally {
        setIsLoading(false);
        setVisible(false);
      }
    } else {
      setVisible(false);
    }
  };

  const handleCancel = () => {
    if (config.onCancel) {
      config.onCancel();
    }
    hideAlert();
  };

  const typeConfig: Record<
    AlertType,
    {
      icon: keyof typeof Ionicons.glyphMap;
      iconColor: string;
      badgeBg: string;
      badgeBorder: string;
      confirmBtnBg: string;
      confirmBtnText: string;
    }
  > = {
    danger: {
      icon: "trash-outline",
      iconColor: "#FF453A",
      badgeBg: "bg-red-500/10",
      badgeBorder: "border-red-500/30",
      confirmBtnBg: "bg-red-600 active:bg-red-700",
      confirmBtnText: "text-white",
    },
    warning: {
      icon: "alert-circle-outline",
      iconColor: "#E5A93C",
      badgeBg: "bg-amber-500/10",
      badgeBorder: "border-amber-500/30",
      confirmBtnBg: "bg-amber-500 active:bg-amber-600",
      confirmBtnText: "text-black",
    },
    success: {
      icon: "checkmark-circle-outline",
      iconColor: "#CCFF00",
      badgeBg: "bg-[#CCFF00]/10",
      badgeBorder: "border-[#CCFF00]/30",
      confirmBtnBg: "bg-primary active:bg-lime-400",
      confirmBtnText: "text-black",
    },
    info: {
      icon: "information-circle-outline",
      iconColor: "#38BDF8",
      badgeBg: "bg-sky-500/10",
      badgeBorder: "border-sky-500/30",
      confirmBtnBg: "bg-sky-500 active:bg-sky-600",
      confirmBtnText: "text-white",
    },
  };

  const currentType = typeConfig[config.type || "info"];

  return (
    <AlertModalContext.Provider value={{ showAlert, showConfirm, hideAlert }}>
      {children}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={hideAlert}
      >
        <View className="flex-1 items-center justify-center bg-black/80 px-6">
          {/* HeroUI Glassmorphic Card Container */}
          <View className="w-full max-w-sm rounded-3xl border border-[#27272A] bg-[#121215] p-6">
            {/* Top Icon Badge */}
            <View className="items-center mb-4">
              <View
                className={`h-14 w-14 items-center justify-center rounded-2xl border ${currentType.badgeBg} ${currentType.badgeBorder}`}
              >
                <Ionicons name={currentType.icon} size={28} color={currentType.iconColor} />
              </View>
            </View>

            {/* Title & Message */}
            <View className="items-center text-center mb-6">
              <Text className="text-xl font-black text-textPrimary text-center tracking-tight">
                {config.title}
              </Text>
              {config.message && (
                <Text className="text-sm font-medium text-textSecondary text-center leading-relaxed mt-2 px-2">
                  {config.message}
                </Text>
              )}
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              {config.showCancel && (
                <Pressable
                  onPress={handleCancel}
                  disabled={isLoading}
                  className="flex-1 h-12 rounded-2xl items-center justify-center border border-[#27272A] bg-[#1E1E24] active:bg-[#272730]"
                >
                  <Text className="text-sm font-bold text-textSecondary">
                    {config.cancelText || "Vazgeç"}
                  </Text>
                </Pressable>
              )}

              <Pressable
                onPress={handleConfirm}
                disabled={isLoading}
                className={`flex-1 h-12 rounded-2xl items-center justify-center ${currentType.confirmBtnBg}`}
              >
                <Text className={`text-sm font-black uppercase tracking-wider ${currentType.confirmBtnText}`}>
                  {isLoading ? "..." : config.confirmText || "Tamam"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </AlertModalContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertModalContext);
}
