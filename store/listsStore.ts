import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TodoList } from '@/types/lists';

interface ListsState {
  lists: TodoList[];
  loading: boolean;
  error: string | null;
  loadLists: () => Promise<void>;
  addList: (list: TodoList) => string;
  updateList: (id: string, list: Partial<TodoList>) => void;
  deleteList: (id: string) => void;
  getListById: (id: string) => TodoList | undefined;
  clearAllLists: () => Promise<void>;
}

export const useListsStore = create<ListsState>((set, get) => ({
  lists: [],
  loading: false,
  error: null,

  loadLists: async () => {
    try {
      set({ loading: true, error: null });
      const storedLists = await AsyncStorage.getItem('lists');
      
      if (storedLists) {
        set({ lists: JSON.parse(storedLists), loading: false });
      } else {
        set({ lists: [], loading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load lists', 
        loading: false 
      });
    }
  },

  addList: (list: TodoList) => {
    set(state => {
      const updatedLists = [...state.lists, list];
      AsyncStorage.setItem('lists', JSON.stringify(updatedLists))
        .catch(error => {
          console.error('Error saving list:', error);
        });
      return { lists: updatedLists };
    });
    return list.id;
  },

  updateList: (id: string, updatedList: Partial<TodoList>) => {
    set(state => {
      const lists = state.lists.map(list => 
        list.id === id ? { ...list, ...updatedList } : list
      );
      
      AsyncStorage.setItem('lists', JSON.stringify(lists))
        .catch(error => {
          console.error('Error updating list:', error);
        });
      
      return { lists };
    });
  },

  deleteList: (id: string) => {
    set(state => {
      const lists = state.lists.filter(list => list.id !== id);
      
      AsyncStorage.setItem('lists', JSON.stringify(lists))
        .catch(error => {
          console.error('Error deleting list:', error);
        });
      
      return { lists };
    });
  },

  getListById: (id: string) => {
    return get().lists.find(list => list.id === id);
  },

  clearAllLists: async () => {
    try {
      await AsyncStorage.removeItem('lists');
      set({ lists: [] });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to clear lists'
      });
    }
  },
}));