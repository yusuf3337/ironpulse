import React from "react";
import { View, Text } from "react-native";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = null,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps): React.JSX.Element {
  return (
    <View
      className={`items-center justify-center rounded-2xl border border-dashed border-surfaceBorder bg-surface/40 p-8 text-center ${className}`}
    >
      {icon ? <View className="mb-4 opacity-80">{icon}</View> : null}
      <Text className="text-base font-bold text-textPrimary text-center">
        {title}
      </Text>
      {description ? (
        <Text className="mt-1 text-center text-xs leading-relaxed text-textSecondary max-w-[260px]">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View className="mt-5">
          <Button
            title={actionLabel}
            onPress={onAction}
            size="sm"
            variant="secondary"
          />
        </View>
      ) : null}
    </View>
  );
}
