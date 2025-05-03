import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { X } from 'lucide-react-native';
import { useListsStore } from '@/store/listsStore';
import { nanoid } from 'nanoid';
import { useRouter } from 'expo-router';

interface CreateListModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateListModal({ visible, onClose }: CreateListModalProps) {
  const [title, setTitle] = useState('');
  const { addList } = useListsStore();
  const router = useRouter();

  const handleCreate = () => {
    if (title.trim()) {
      const newList = {
        id: nanoid(),
        title: title.trim(),
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const listId = addList(newList);
      onClose();
      setTitle('');
      
      // Navigate to the new list
      router.push(`/list/${listId}`);
    }
  };

  const handleCancel = () => {
    onClose();
    setTitle('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.contentContainer}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Create New List</Text>
                <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                  <X size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="List Title"
                placeholderTextColor={COLORS.textTertiary}
                autoFocus
                autoCapitalize="sentences"
              />
              
              <View style={styles.buttons}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.createButton]} 
                  onPress={handleCreate}
                  disabled={!title.trim()}
                >
                  <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    width: '85%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: COLORS.paperWhite,
    borderRadius: 12,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  input: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  createButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  createButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
});