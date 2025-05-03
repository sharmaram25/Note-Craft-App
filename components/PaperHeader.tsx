import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';

interface PaperHeaderProps {
  title: string;
  rightIcon?: React.ReactNode;
}

export function PaperHeader({ title, rightIcon }: PaperHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontFamily: 'Caveat-Bold',
    fontSize: 28,
    color: COLORS.textPrimary,
  },
  rightIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});