import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { COLORS } from '@/constants/theme';

interface DropdownOption {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  danger?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  onClose: () => void;
}

export function Dropdown({ options, onClose }: DropdownProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.dropdown}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => {
              onClose();
              option.onPress();
            }}
          >
            {option.icon && <View style={styles.icon}>{option.icon}</View>}
            <Text
              style={[
                styles.optionText,
                option.danger && styles.dangerText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: COLORS.paperWhite,
    borderRadius: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: 180,
    zIndex: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  icon: {
    marginRight: 12,
  },
  optionText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  dangerText: {
    color: COLORS.danger,
  },
});