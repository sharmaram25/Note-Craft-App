import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { formatRelativeDate } from '@/utils/dateUtils';
import { Note } from '@/types/notes';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  const formattedDate = useMemo(() => {
    return formatRelativeDate(new Date(note.updatedAt));
  }, [note.updatedAt]);

  const contentPreview = useMemo(() => {
    const plainTextContent = note.content.replace(/\\s+/g, ' ').trim();
    return plainTextContent.length > 80
      ? `${plainTextContent.substring(0, 80)}...`
      : plainTextContent;
  }, [note.content]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {contentPreview}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: COLORS.paperWhite,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  title: {
    fontFamily: 'Caveat-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  preview: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  date: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: COLORS.textTertiary,
  },
});