import React from "react";
import { View, Text, Pressable } from "react-native";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  className = "",
}: SectionHeaderProps): React.JSX.Element {
  return (
    <View className={`mb-3 flex-row items-end justify-between ${className}`}>
      <View className="flex-1 pr-2">
        <Text className="text-lg font-black tracking-tight text-textPrimary uppercase">
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-0.5 text-xs text-textSecondary font-medium">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} className="active:opacity-70 py-1">
          <Text className="text-xs font-bold uppercase tracking-wider text-primary">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
