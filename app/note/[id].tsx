import { useCallback, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { PaperBackground } from '@/components/PaperBackground';
import { NoteEditor } from '@/components/NoteEditor';
import { ArrowLeft, Save, MoveVertical as MoreVertical, Trash2 } from 'lucide-react-native';
import { useNotesStore } from '@/store/notesStore';
import { Note } from '@/types/notes';
import { Dropdown } from '@/components/Dropdown';

export default function EditNotePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const { getNoteById, updateNote, deleteNote } = useNotesStore();
  
  const note = getNoteById(id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSaveNote = useCallback(() => {
    if (note) {
      updateNote(id, {
        ...note,
        title,
        content,
        updatedAt: new Date().toISOString(),
      });
      setIsEdited(false);
    }
  }, [title, content, note, id, updateNote]);

  const handleDeleteNote = useCallback(() => {
    if (id) {
      deleteNote(id);
      router.back();
    }
  }, [id, deleteNote, router]);

  const handleBackPress = useCallback(() => {
    if (isEdited) {
      handleSaveNote();
    }
    router.back();
  }, [isEdited, handleSaveNote, router]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownVisible(!isDropdownVisible);
  }, [isDropdownVisible]);

  const handleTitleChange = useCallback((text: string) => {
    setTitle(text);
    setIsEdited(true);
  }, []);

  const handleContentChange = useCallback((text: string) => {
    setContent(text);
    setIsEdited(true);
  }, []);

  if (!note) {
    return null;
  }

  return (
    <PaperBackground lined>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity 
            onPress={handleBackPress}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={handleSaveNote}
              style={[styles.saveButton, !isEdited && styles.saveButtonDisabled]}
              disabled={!isEdited}
            >
              <Save size={20} color={isEdited ? COLORS.primary : COLORS.textTertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={toggleDropdown}
              style={styles.moreButton}
            >
              <MoreVertical size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            
            {isDropdownVisible && (
              <Dropdown
                options={[
                  {
                    label: 'Delete Note',
                    icon: <Trash2 size={16} color={COLORS.danger} />,
                    onPress: handleDeleteNote,
                    danger: true,
                  },
                ]}
                onClose={() => setIsDropdownVisible(false)}
              />
            )}
          </View>
        </View>
        
        <ScrollView 
          style={styles.content}
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={handleTitleChange}
            placeholder="Note Title"
            placeholderTextColor={COLORS.textTertiary}
            multiline={true}
          />
          
          <NoteEditor 
            value={content}
            onChange={handleContentChange}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    padding: 8,
    marginRight: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  moreButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontFamily: 'Caveat-Bold',
    fontSize: 28,
    color: COLORS.textPrimary,
    marginBottom: 16,
    padding: 0,
  },
});