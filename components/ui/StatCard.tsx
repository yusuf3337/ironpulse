import React from "react";
import { View, Text } from "react-native";
import { Card } from "./Card";

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  gold?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit = "",
  icon = null,
  highlight = false,
  gold = false,
  className = "",
}: StatCardProps): React.JSX.Element {
  const variant = gold ? "goldHighlight" : highlight ? "highlight" : "default";

  return (
    <Card variant={variant} className={`flex-1 p-3 justify-between ${className}`}>
      <View className="flex-row items-center justify-between mb-1.5">
        <Text
          numberOfLines={1}
          className="text-[10px] font-bold uppercase tracking-wider text-textSecondary flex-1 mr-1"
        >
          {label}
        </Text>
        {icon ? <View>{icon}</View> : null}
      </View>
      <View className="flex-row items-baseline flex-wrap">
        <Text
          numberOfLines={1}
          className={`text-xl font-black tracking-tight ${
            gold ? "text-gold" : highlight ? "text-primary" : "text-textPrimary"
          }`}
        >
          {value}
        </Text>
        {unit ? (
          <Text className="ml-1 text-[9px] font-bold text-textMuted uppercase">
            {unit}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}
