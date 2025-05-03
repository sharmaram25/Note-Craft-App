import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { COLORS } from '@/constants/theme';
import { PaperHeader } from '@/components/PaperHeader';
import { PaperBackground } from '@/components/PaperBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Save, Trash2, History } from 'lucide-react-native';
import { useAppSettings } from '@/store/settingsStore';
import { useNotesStore } from '@/store/notesStore';
import { useListsStore } from '@/store/listsStore';
import { useRemindersStore } from '@/store/remindersStore';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { 
    notificationsEnabled,
    setNotificationsEnabled,
    autoSave,
    setAutoSave,
    searchHistory,
    clearSearchHistory
  } = useAppSettings();
  const { clearAllNotes } = useNotesStore();
  const { clearAllLists } = useListsStore();
  const { clearAllReminders } = useRemindersStore();
  const [noteCount, setNoteCount] = useState(0);
  const [listCount, setListCount] = useState(0);
  const [reminderCount, setReminderCount] = useState(0);

  useEffect(() => {
    const nc = useNotesStore.getState().notes.length;
    const lc = useListsStore.getState().lists.length;
    const rc = useRemindersStore.getState().reminders.length;

    setNoteCount(nc);
    setListCount(lc);
    setReminderCount(rc);
  }, []);

  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all notes, lists, and reminders? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete All", 
          onPress: () => {
            clearAllNotes();
            clearAllLists();
            clearAllReminders();
            setNoteCount(0);
            setListCount(0);
            setReminderCount(0);
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleClearSearchHistory = () => {
    Alert.alert(
      "Clear Search History",
      "Are you sure you want to clear your search history?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Clear", 
          onPress: clearSearchHistory,
          style: "destructive"
        }
      ]
    );
  };

  return (
    <PaperBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <PaperHeader title="Settings" />
        
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemInfo}>
                <Bell size={22} color={COLORS.textSecondary} />
                <Text style={styles.settingItemText}>Notifications</Text>
              </View>
              <Switch 
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor={notificationsEnabled ? COLORS.primary : COLORS.paperWhite}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemInfo}>
                <Save size={22} color={COLORS.textSecondary} />
                <Text style={styles.settingItemText}>Auto-Save</Text>
              </View>
              <Switch 
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor={autoSave ? COLORS.primary : COLORS.paperWhite}
              />
            </View>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleClearSearchHistory}
            >
              <View style={styles.settingItemInfo}>
                <History size={22} color={COLORS.textSecondary} />
                <Text style={styles.settingItemText}>Clear Search History</Text>
              </View>
              <Text style={styles.settingDetail}>
                {searchHistory.length} items
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{noteCount}</Text>
                <Text style={styles.statLabel}>Notes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{listCount}</Text>
                <Text style={styles.statLabel}>Lists</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{reminderCount}</Text>
                <Text style={styles.statLabel}>Reminders</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, styles.dangerButton]}
              onPress={handleClearAllData}
            >
              <Trash2 size={20} color={COLORS.danger} />
              <Text style={styles.dangerButtonText}>Clear All Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.paperWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  settingDetail: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.textTertiary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  dangerButton: {
    backgroundColor: COLORS.dangerLight,
  },
  dangerButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.danger,
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    color: COLORS.primary,
  },
  statLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});