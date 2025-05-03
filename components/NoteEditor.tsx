import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';

interface NoteEditorProps {
  value: string;
  onChange: (text: string) => void;
}

export function NoteEditor({ value, onChange }: NoteEditorProps) {
  return (
    <TextInput
      style={styles.editor}
      value={value}
      onChangeText={onChange}
      placeholder="Start typing your note..."
      placeholderTextColor={COLORS.textTertiary}
      multiline
      textAlignVertical="top"
      autoCapitalize="sentences"
      autoComplete="off"
      autoCorrect
    />
  );
}

const styles = StyleSheet.create({
  editor: {
    flex: 1,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
    minHeight: 200,
    textAlignVertical: 'top',
    padding: 0,
  },
});