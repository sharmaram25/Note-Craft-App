import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { formatRelativeDate } from '@/utils/dateUtils';
import { TodoList } from '@/types/lists';
import { CircleCheck as CheckCircle, Circle } from 'lucide-react-native';

interface ListCardProps {
  list: TodoList;
  onPress: () => void;
}

export function ListCard({ list, onPress }: ListCardProps) {
  const formattedDate = useMemo(() => {
    return formatRelativeDate(new Date(list.updatedAt));
  }, [list.updatedAt]);

  const { completed, total } = useMemo(() => {
    const totalItems = list.items.length;
    const completedItems = list.items.filter(item => item.completed).length;
    return { total: totalItems, completed: completedItems };
  }, [list.items]);

  // Get the first 3 items to show as preview
  const previewItems = useMemo(() => {
    return list.items.slice(0, 3);
  }, [list.items]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {list.title}
        </Text>
        
        <View style={styles.itemsPreview}>
          {previewItems.map(item => (
            <View key={item.id} style={styles.previewItem}>
              {item.completed ? (
                <CheckCircle size={16} color={COLORS.primary} />
              ) : (
                <Circle size={16} color={COLORS.textSecondary} />
              )}
              <Text 
                style={[
                  styles.previewItemText,
                  item.completed && styles.previewItemTextCompleted
                ]}
                numberOfLines={1}
              >
                {item.text}
              </Text>
            </View>
          ))}
          
          {list.items.length > 3 && (
            <Text style={styles.moreItems}>
              +{list.items.length - 3} more items
            </Text>
          )}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.progress}>
            {completed}/{total} completed
          </Text>
        </View>
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
    marginBottom: 12,
  },
  itemsPreview: {
    marginBottom: 12,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewItemText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  previewItemTextCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textTertiary,
  },
  moreItems: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 4,
    marginLeft: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  progress: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: COLORS.primary,
  },
});