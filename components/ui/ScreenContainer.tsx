import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView, Edge, useSafeAreaInsets } from "react-native-safe-area-context";

export interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  className?: string;
  contentContainerClassName?: string;
  edges?: Edge[];
}

export function ScreenContainer({
  children,
  scrollable = false,
  className = "",
  contentContainerClassName = "",
  edges = ["top", "left", "right"],
}: ScreenContainerProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  if (scrollable) {
    return (
      <SafeAreaView edges={edges} className={`flex-1 bg-background ${className}`}>
        <ScrollView
          className="flex-1"
          contentContainerClassName={`px-4 pt-2 pb-28 ${contentContainerClassName}`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={edges}
      className={`flex-1 bg-background px-4 pt-2 pb-6 ${className}`}
    >
      {children}
    </SafeAreaView>
  );
}
