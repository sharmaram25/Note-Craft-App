import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/theme';

interface PaperBackgroundProps {
  children: React.ReactNode;
  lined?: boolean;
  style?: ViewStyle;
}

export function PaperBackground({ children, lined = false, style }: PaperBackgroundProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.background, lined && styles.lined]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.paperBackground,
  },
  background: {
    flex: 1,
    backgroundColor: COLORS.paperBackground,
  },
  lined: {
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});