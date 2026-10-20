import React from "react";
import { Pressable, Text, ActivityIndicator, View } from "react-native";

export type ButtonVariant = "primary" | "secondary" | "gold" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon = null,
  className = "",
  textClassName = "",
}: ButtonProps): React.JSX.Element {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary active:opacity-85",
    secondary: "bg-surface border border-surfaceBorder active:bg-surfaceHover",
    gold: "bg-gold active:opacity-85",
    danger: "bg-danger active:opacity-85",
    ghost: "bg-transparent active:bg-surface/50",
  };

  const textVariantStyles: Record<ButtonVariant, string> = {
    primary: "text-black font-extrabold",
    secondary: "text-textPrimary font-semibold",
    gold: "text-black font-bold",
    danger: "text-white font-bold",
    ghost: "text-textSecondary font-semibold",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "py-2 px-3 rounded-lg",
    md: "py-3.5 px-4 rounded-xl",
    lg: "py-4 px-6 rounded-2xl",
  };

  const textSizeStyles: Record<ButtonSize, string> = {
    sm: "text-xs tracking-wider uppercase",
    md: "text-sm tracking-wide",
    lg: "text-base tracking-wide",
  };

  const currentVariant = variantStyles[variant] ?? variantStyles.primary;
  const currentTextVariant = textVariantStyles[variant] ?? textVariantStyles.primary;
  const currentSize = sizeStyles[size] ?? sizeStyles.md;
  const currentTextSize = textSizeStyles[size] ?? textSizeStyles.md;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${currentSize} ${currentVariant} ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "gold" ? "#000000" : "#FFFFFF"}
        />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Text className={`${currentTextSize} ${currentTextVariant} text-center ${textClassName}`}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
