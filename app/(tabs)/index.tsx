import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { PaperHeader } from '@/components/PaperHeader';
import { NoteCard } from '@/components/NoteCard';
import { CirclePlus as PlusCircle, Search } from 'lucide-react-native';
import { PaperBackground } from '@/components/PaperBackground';
import { useNotesStore } from '@/store/notesStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UniversalSearch } from '@/components/UniversalSearch';

export default function NotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { notes, loadNotes } = useNotesStore();
  const [showSearch, setShowSearch] = useState(false);
  
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleCreateNote = useCallback(() => {
    router.push('/note/create');
  }, [router]);

  const handleNotePress = useCallback((noteId: string) => {
    router.push(`/note/${noteId}`);
  }, [router]);

  const toggleSearch = useCallback(() => {
    setShowSearch(prev => !prev);
  }, []);

  return (
    <PaperBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <PaperHeader 
          title="My Notes" 
          rightIcon={(
            <TouchableOpacity onPress={toggleSearch}>
              <Search size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}
        />

        {notes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notes yet</Text>
            <Text style={styles.emptySubText}>
              Tap the + button to create your first note
            </Text>
          </View>
        ) : (
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NoteCard note={item} onPress={() => handleNotePress(item.id)} />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}

        <TouchableOpacity style={styles.fab} onPress={handleCreateNote}>
          <PlusCircle size={56} color={COLORS.primary} fill={COLORS.paperWhite} />
        </TouchableOpacity>

        <UniversalSearch 
          visible={showSearch} 
          onClose={() => setShowSearch(false)} 
        />
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