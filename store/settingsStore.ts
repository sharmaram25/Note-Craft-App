import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettingsState {
  notificationsEnabled: boolean;
  autoSave: boolean;
  searchHistory: string[];
  initialized: boolean;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setAutoSave: (enabled: boolean) => Promise<void>;
  addSearchTerm: (term: string) => Promise<void>;
  clearSearchHistory: () => Promise<void>;
  setInitialized: (initialized: boolean) => void;
}

export const useAppSettings = create<AppSettingsState>((set) => ({
  notificationsEnabled: true,
  autoSave: true,
  searchHistory: [],
  initialized: false,
  
  setNotificationsEnabled: async (enabled) => {
    try {
      await AsyncStorage.setItem('notificationsEnabled', String(enabled));
      set({ notificationsEnabled: enabled });
    } catch (error) {
      console.error('Error saving notifications setting:', error);
    }
  },

  setAutoSave: async (enabled) => {
    try {
      await AsyncStorage.setItem('autoSave', String(enabled));
      set({ autoSave: enabled });
    } catch (error) {
      console.error('Error saving auto-save setting:', error);
    }
  },

  addSearchTerm: async (term) => {
    try {
      const currentHistory = useAppSettings.getState().searchHistory;
      const newHistory = [term, ...currentHistory.filter(t => t !== term)].slice(0, 10);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
      set({ searchHistory: newHistory });
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  },

  clearSearchHistory: async () => {
    try {
      await AsyncStorage.removeItem('searchHistory');
      set({ searchHistory: [] });
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  },

  setInitialized: (initialized) => set({ initialized }),
}));

// Initialize settings from AsyncStorage
export const initSettings = async () => {
  try {
    const [notificationsEnabled, autoSave, searchHistory] = await Promise.all([
      AsyncStorage.getItem('notificationsEnabled'),
      AsyncStorage.getItem('autoSave'),
      AsyncStorage.getItem('searchHistory'),
    ]);

    useAppSettings.setState({
      notificationsEnabled: notificationsEnabled === null ? true : notificationsEnabled === 'true',
      autoSave: autoSave === null ? true : autoSave === 'true',
      searchHistory: searchHistory ? JSON.parse(searchHistory) : [],
      initialized: true,
    });
  } catch (error) {
    console.error('Error loading settings:', error);
    // Set default values if loading fails
    useAppSettings.setState({
      notificationsEnabled: true,
      autoSave: true,
      searchHistory: [],
      initialized: true,
    });
  }
};