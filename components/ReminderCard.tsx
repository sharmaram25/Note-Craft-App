import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { Reminder } from '@/types/reminders';
import { CircleCheck as CheckCircle, Circle, Clock } from 'lucide-react-native';
import { formatTime } from '@/utils/dateUtils';

interface ReminderCardProps {
  reminder: Reminder;
  onToggleComplete: () => void;
}

export function ReminderCard({ reminder, onToggleComplete }: ReminderCardProps) {
  const formattedTime = useMemo(() => {
    return reminder.time ? formatTime(reminder.time) : null;
  }, [reminder.time]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={onToggleComplete}
      >
        {reminder.completed ? (
          <CheckCircle size={24} color={COLORS.primary} />
        ) : (
          <Circle size={24} color={COLORS.textSecondary} />
        )}
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text 
          style={[
            styles.title,
            reminder.completed && styles.completedText
          ]}
        >
          {reminder.title}
        </Text>
        
        {reminder.description ? (
          <Text 
            style={[
              styles.description,
              reminder.completed && styles.completedText
            ]}
            numberOfLines={2}
          >
            {reminder.description}
          </Text>
        ) : null}
        
        {formattedTime && (
          <View style={styles.timeContainer}>
            <Clock size={14} color={COLORS.textTertiary} />
            <Text style={styles.time}>{formattedTime}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 12,
    backgroundColor: COLORS.paperWhite,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textTertiary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: COLORS.textTertiary,
    marginLeft: 4,
  },
});