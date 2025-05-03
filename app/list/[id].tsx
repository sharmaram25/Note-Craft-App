import { useCallback, useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Text,
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { PaperBackground } from '@/components/PaperBackground';
import { ArrowLeft, Save, MoveVertical as MoreVertical, Trash2, Plus, CircleCheck as CheckCircle, Circle } from 'lucide-react-native';
import { useListsStore } from '@/store/listsStore';
import { TodoItem } from '@/types/lists';
import { Dropdown } from '@/components/Dropdown';
import { nanoid } from 'nanoid';

export default function EditListPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getListById, updateList, deleteList } = useListsStore();
  
  const list = getListById(id);
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<TodoItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (list) {
      setTitle(list.title);
      setItems(list.items);
    }
  }, [list]);

  const handleSaveList = useCallback(() => {
    if (list) {
      updateList(id, {
        ...list,
        title,
        items,
        updatedAt: new Date().toISOString(),
      });
      setIsEdited(false);
    }
  }, [title, items, list, id, updateList]);

  const handleDeleteList = useCallback(() => {
    if (id) {
      deleteList(id);
      router.back();
    }
  }, [id, deleteList, router]);

  const handleBackPress = useCallback(() => {
    if (isEdited) {
      handleSaveList();
    }
    router.back();
  }, [isEdited, handleSaveList, router]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownVisible(!isDropdownVisible);
  }, [isDropdownVisible]);

  const handleTitleChange = useCallback((text: string) => {
    setTitle(text);
    setIsEdited(true);
  }, []);

  const handleToggleItem = useCallback((itemId: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
    setIsEdited(true);
  }, []);

  const handleAddItem = useCallback(() => {
    if (newItemText.trim()) {
      const newItem: TodoItem = {
        id: nanoid(),
        text: newItemText.trim(),
        completed: false,
      };
      setItems(prevItems => [...prevItems, newItem]);
      setNewItemText('');
      setIsEdited(true);
    }
  }, [newItemText]);

  const handleDeleteItem = useCallback((itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    setIsEdited(true);
  }, []);

  const handleUpdateItemText = useCallback((itemId: string, text: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, text }
          : item
      )
    );
    setIsEdited(true);
  }, []);

  if (!list) {
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
              onPress={handleSaveList}
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
                    label: 'Delete List',
                    icon: <Trash2 size={16} color={COLORS.danger} />,
                    onPress: handleDeleteList,
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
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={handleTitleChange}
            placeholder="List Title"
            placeholderTextColor={COLORS.textTertiary}
          />
          
          {items.map(item => (
            <View key={item.id} style={styles.todoItem}>
              <TouchableOpacity 
                onPress={() => handleToggleItem(item.id)}
                style={styles.checkbox}
              >
                {item.completed ? (
                  <CheckCircle size={24} color={COLORS.primary} />
                ) : (
                  <Circle size={24} color={COLORS.textSecondary} />
                )}
              </TouchableOpacity>
              
              <TextInput
                style={[
                  styles.todoText,
                  item.completed && styles.todoTextCompleted
                ]}
                value={item.text}
                onChangeText={(text) => handleUpdateItemText(item.id, text)}
                multiline
              />
              
              <TouchableOpacity 
                onPress={() => handleDeleteItem(item.id)}
                style={styles.deleteButton}
              >
                <Trash2 size={18} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          ))}
          
          <View style={styles.addItemContainer}>
            <View style={styles.addItemInput}>
              <TextInput
                style={styles.input}
                value={newItemText}
                onChangeText={setNewItemText}
                placeholder="Add new item..."
                placeholderTextColor={COLORS.textTertiary}
                onSubmitEditing={handleAddItem}
                returnKeyType="done"
              />
              
              <TouchableOpacity 
                onPress={handleAddItem}
                style={styles.addButton}
                disabled={!newItemText.trim()}
              >
                <Plus 
                  size={20} 
                  color={newItemText.trim() ? COLORS.primary : COLORS.textTertiary} 
                />
              </TouchableOpacity>
            </View>
          </View>
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
    marginBottom: 24,
    padding: 0,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
  },
  checkbox: {
    marginRight: 12,
  },
  todoText: {
    flex: 1,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textTertiary,
  },
  deleteButton: {
    padding: 6,
    marginLeft: 8,
  },
  addItemContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
  addItemInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    padding: 8,
  },
  addButton: {
    padding: 8,
  },
});