import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder } from '@/types/reminders';

interface RemindersState {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  loadReminders: () => Promise<void>;
  addReminder: (reminder: Reminder) => string;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleComplete: (id: string) => void;
  getReminderById: (id: string) => Reminder | undefined;
  clearAllReminders: () => Promise<void>;
}

export const useRemindersStore = create<RemindersState>((set, get) => ({
  reminders: [],
  loading: false,
  error: null,

  loadReminders: async () => {
    try {
      set({ loading: true, error: null });
      const storedReminders = await AsyncStorage.getItem('reminders');
      
      if (storedReminders) {
        set({ reminders: JSON.parse(storedReminders), loading: false });
      } else {
        set({ reminders: [], loading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load reminders', 
        loading: false 
      });
    }
  },

  addReminder: (reminder: Reminder) => {
    set(state => {
      const updatedReminders = [...state.reminders, reminder];
      AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders))
        .catch(error => {
          console.error('Error saving reminder:', error);
        });
      return { reminders: updatedReminders };
    });
    return reminder.id;
  },

  updateReminder: (id: string, updatedReminder: Partial<Reminder>) => {
    set(state => {
      const reminders = state.reminders.map(reminder => 
        reminder.id === id ? { ...reminder, ...updatedReminder } : reminder
      );
      
      AsyncStorage.setItem('reminders', JSON.stringify(reminders))
        .catch(error => {
          console.error('Error updating reminder:', error);
        });
      
      return { reminders };
    });
  },

  deleteReminder: (id: string) => {
    set(state => {
      const reminders = state.reminders.filter(reminder => reminder.id !== id);
      
      AsyncStorage.setItem('reminders', JSON.stringify(reminders))
        .catch(error => {
          console.error('Error deleting reminder:', error);
        });
      
      return { reminders };
    });
  },

  toggleComplete: (id: string) => {
    set(state => {
      const reminders = state.reminders.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed } 
          : reminder
      );
      
      AsyncStorage.setItem('reminders', JSON.stringify(reminders))
        .catch(error => {
          console.error('Error toggling reminder completion:', error);
        });
      
      return { reminders };
    });
  },

  getReminderById: (id: string) => {
    return get().reminders.find(reminder => reminder.id === id);
  },

  clearAllReminders: async () => {
    try {
      await AsyncStorage.removeItem('reminders');
      set({ reminders: [] });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to clear reminders'
      });
    }
  },
}));