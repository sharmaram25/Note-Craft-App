import { useCallback, useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { PaperBackground } from '@/components/PaperBackground';
import { NoteEditor } from '@/components/NoteEditor';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useNotesStore } from '@/store/notesStore';
import { nanoid } from 'nanoid';

export default function CreateNotePage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addNote } = useNotesStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSaveNote = useCallback(() => {
    if (title.trim() === '' && content.trim() === '') {
      // Don't save empty notes
      router.back();
      return;
    }
    
    const newNote = {
      id: nanoid(),
      title: title.trim() === '' ? 'Untitled Note' : title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    addNote(newNote);
    router.back();
  }, [title, content, addNote, router]);

  const handleBackPress = useCallback(() => {
    if (title.trim() !== '' || content.trim() !== '') {
      handleSaveNote();
    } else {
      router.back();
    }
  }, [title, content, handleSaveNote, router]);

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
          
          <TouchableOpacity 
            onPress={handleSaveNote}
            style={styles.saveButton}
          >
            <Save size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Note Title"
            placeholderTextColor={COLORS.textTertiary}
            multiline={true}
            autoFocus
          />
          
          <NoteEditor 
            value={content}
            onChange={setContent}
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
  saveButton: {
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