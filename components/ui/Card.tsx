import React from "react";
import { View, Pressable } from "react-native";

export type CardVariant = "default" | "elevated" | "highlight" | "goldHighlight";

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  variant?: CardVariant;
}

export function Card({
  children,
  onPress,
  className = "",
  variant = "default",
}: CardProps): React.JSX.Element {
  const variantStyles: Record<CardVariant, string> = {
    default: "bg-surface border border-surfaceBorder",
    elevated: "bg-surfaceHover border border-surfaceBorder shadow-md",
    highlight: "bg-surface border border-primary/40",
    goldHighlight: "bg-surface border border-gold/40",
  };

  const styleClass = variantStyles[variant] ?? variantStyles.default;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`rounded-2xl p-4 active:opacity-85 ${styleClass} ${className}`}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={`rounded-2xl p-4 ${styleClass} ${className}`}>
      {children}
    </View>
  );
}
