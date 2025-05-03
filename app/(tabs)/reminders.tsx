import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { PaperHeader } from '@/components/PaperHeader';
import { ReminderCard } from '@/components/ReminderCard';
import { CirclePlus as PlusCircle } from 'lucide-react-native';
import { PaperBackground } from '@/components/PaperBackground';
import { useRemindersStore } from '@/store/remindersStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreateReminderModal } from '@/components/CreateReminderModal';
import { formatDate } from '@/utils/dateUtils';

export default function RemindersScreen() {
  const insets = useSafeAreaInsets();
  const { reminders, loadReminders, toggleComplete } = useRemindersStore();
  const [modalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  // Group reminders by date
  const groupedReminders = reminders.reduce((acc, reminder) => {
    const date = formatDate(new Date(reminder.date));
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(reminder);
    return acc;
  }, {} as Record<string, typeof reminders>);

  // Transform the grouped object into an array for FlatList
  const sections = Object.entries(groupedReminders).map(([date, items]) => ({
    date,
    data: items,
  }));

  // Sort sections by date (oldest first)
  sections.sort((a, b) => {
    return new Date(a.data[0].date).getTime() - new Date(b.data[0].date).getTime();
  });

  const handleCreateReminder = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleToggleComplete = useCallback((id: string) => {
    toggleComplete(id);
  }, [toggleComplete]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return (
    <PaperBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <PaperHeader title="Reminders" />

        {reminders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reminders yet</Text>
            <Text style={styles.emptySubText}>
              Tap the + button to create your first reminder
            </Text>
          </View>
        ) : (
          <FlatList
            data={sections}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>{item.date}</Text>
                {item.data.map(reminder => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onToggleComplete={() => handleToggleComplete(reminder.id)}
                  />
                ))}
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}

        <TouchableOpacity style={styles.fab} onPress={handleCreateReminder}>
          <PlusCircle size={56} color={COLORS.primary} fill={COLORS.paperWhite} />
        </TouchableOpacity>

        <CreateReminderModal visible={modalVisible} onClose={closeModal} />
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 28,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  emptySubText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
});