import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { X, Search, Clock, FileText, ListTodo, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useNotesStore } from '@/store/notesStore';
import { useListsStore } from '@/store/listsStore';
import { useRemindersStore } from '@/store/remindersStore';
import { useAppSettings } from '@/store/settingsStore';
import { formatRelativeDate } from '@/utils/dateUtils';

interface SearchResult {
  id: string;
  title: string;
  type: 'note' | 'list' | 'reminder';
  date: string;
}

interface UniversalSearchProps {
  visible: boolean;
  onClose: () => void;
}

export function UniversalSearch({ visible, onClose }: UniversalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();
  const { notes } = useNotesStore();
  const { lists } = useListsStore();
  const { reminders } = useRemindersStore();
  const { searchHistory, addSearchTerm } = useAppSettings();

  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search notes
    notes.forEach(note => {
      if (
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
      ) {
        searchResults.push({
          id: note.id,
          title: note.title,
          type: 'note',
          date: note.updatedAt,
        });
      }
    });

    // Search lists
    lists.forEach(list => {
      if (
        list.title.toLowerCase().includes(searchTerm) ||
        list.items.some(item => item.text.toLowerCase().includes(searchTerm))
      ) {
        searchResults.push({
          id: list.id,
          title: list.title,
          type: 'list',
          date: list.updatedAt,
        });
      }
    });

    // Search reminders
    reminders.forEach(reminder => {
      if (
        reminder.title.toLowerCase().includes(searchTerm) ||
        (reminder.description && reminder.description.toLowerCase().includes(searchTerm))
      ) {
        searchResults.push({
          id: reminder.id,
          title: reminder.title,
          type: 'reminder',
          date: reminder.date,
        });
      }
    });

    // Sort by date, newest first
    searchResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setResults(searchResults);
  }, [notes, lists, reminders]);

  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery, performSearch]);

  const handleResultPress = useCallback((result: SearchResult) => {
    if (searchQuery.trim()) {
      addSearchTerm(searchQuery.trim());
    }
    
    switch (result.type) {
      case 'note':
        router.push(`/note/${result.id}`);
        break;
      case 'list':
        router.push(`/list/${result.id}`);
        break;
      case 'reminder':
        // For reminders, we might want to scroll to the specific reminder in the reminders tab
        router.push('/reminders');
        break;
    }
    onClose();
  }, [router, searchQuery, addSearchTerm, onClose]);

  const handleHistoryItemPress = useCallback((term: string) => {
    setSearchQuery(term);
  }, []);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText size={20} color={COLORS.textSecondary} />;
      case 'list':
        return <ListTodo size={20} color={COLORS.textSecondary} />;
      case 'reminder':
        return <Calendar size={20} color={COLORS.textSecondary} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchHeader}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search notes, lists, and reminders..."
                placeholderTextColor={COLORS.textTertiary}
                autoFocus
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={searchQuery ? results : searchHistory}
            keyExtractor={(item) => (searchQuery ? `${item.type}-${item.id}` : item)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => 
                  searchQuery 
                    ? handleResultPress(item as SearchResult)
                    : handleHistoryItemPress(item as string)
                }
              >
                {searchQuery ? (
                  <>
                    {getIconForType((item as SearchResult).type)}
                    <View style={styles.resultContent}>
                      <Text style={styles.resultTitle}>
                        {(item as SearchResult).title}
                      </Text>
                      <Text style={styles.resultMeta}>
                        {(item as SearchResult).type.charAt(0).toUpperCase() + 
                         (item as SearchResult).type.slice(1)} • {
                         formatRelativeDate(new Date((item as SearchResult).date))}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Clock size={20} color={COLORS.textSecondary} />
                    <Text style={styles.historyText}>{item as string}</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              searchQuery ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No results found</Text>
                </View>
              ) : null
            }
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  searchContainer: {
    backgroundColor: COLORS.paperWhite,
    marginTop: Platform.OS === 'ios' ? 40 : 0,
    borderTopLeftRadius: Platform.OS === 'ios' ? 12 : 0,
    borderTopRightRadius: Platform.OS === 'ios' ? 12 : 0,
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.primary,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultContent: {
    marginLeft: 12,
    flex: 1,
  },
  resultTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  resultMeta: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  historyText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.textTertiary,
  },
});