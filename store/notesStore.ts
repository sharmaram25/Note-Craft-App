import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '@/types/notes';

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  loadNotes: () => Promise<void>;
  addNote: (note: Note) => string;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  clearAllNotes: () => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,
  error: null,

  loadNotes: async () => {
    try {
      set({ loading: true, error: null });
      const storedNotes = await AsyncStorage.getItem('notes');
      
      if (storedNotes) {
        set({ notes: JSON.parse(storedNotes), loading: false });
      } else {
        set({ notes: [], loading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load notes', 
        loading: false 
      });
    }
  },

  addNote: (note: Note) => {
    set(state => {
      const updatedNotes = [...state.notes, note];
      AsyncStorage.setItem('notes', JSON.stringify(updatedNotes))
        .catch(error => {
          console.error('Error saving note:', error);
        });
      return { notes: updatedNotes };
    });
    return note.id;
  },

  updateNote: (id: string, updatedNote: Partial<Note>) => {
    set(state => {
      const notes = state.notes.map(note => 
        note.id === id ? { ...note, ...updatedNote } : note
      );
      
      AsyncStorage.setItem('notes', JSON.stringify(notes))
        .catch(error => {
          console.error('Error updating note:', error);
        });
      
      return { notes };
    });
  },

  deleteNote: (id: string) => {
    set(state => {
      const notes = state.notes.filter(note => note.id !== id);
      
      AsyncStorage.setItem('notes', JSON.stringify(notes))
        .catch(error => {
          console.error('Error deleting note:', error);
        });
      
      return { notes };
    });
  },

  getNoteById: (id: string) => {
    return get().notes.find(note => note.id === id);
  },

  clearAllNotes: async () => {
    try {
      await AsyncStorage.removeItem('notes');
      set({ notes: [] });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to clear notes'
      });
    }
  },
}));