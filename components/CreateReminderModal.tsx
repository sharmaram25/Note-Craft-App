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
import { X, Calendar, Clock } from 'lucide-react-native';
import { useRemindersStore } from '@/store/remindersStore';
import { nanoid } from 'nanoid';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CreateReminderModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateReminderModal({ visible, onClose }: CreateReminderModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const { addReminder } = useRemindersStore();

  const handleCreate = () => {
    if (title.trim()) {
      // Combine date and time
      const reminderDate = new Date(date);
      reminderDate.setHours(time.getHours());
      reminderDate.setMinutes(time.getMinutes());
      
      const newReminder = {
        id: nanoid(),
        title: title.trim(),
        description: description.trim(),
        date: reminderDate.toISOString(),
        time: `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`,
        completed: false,
      };
      
      addReminder(newReminder);
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setTitle('');
    setDescription('');
    setDate(new Date());
    setTime(new Date());
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={resetAndClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.contentContainer}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Create Reminder</Text>
                <TouchableOpacity onPress={resetAndClose} style={styles.closeButton}>
                  <X size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Reminder Title"
                placeholderTextColor={COLORS.textTertiary}
                autoFocus
                autoCapitalize="sentences"
              />
              
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="Description (optional)"
                placeholderTextColor={COLORS.textTertiary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity 
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar size={18} color={COLORS.primary} />
                  <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.dateTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Clock size={18} color={COLORS.primary} />
                  <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
                </TouchableOpacity>
              </View>
              
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              
              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
              
              <View style={styles.buttons}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={resetAndClose}
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
    marginBottom: 16,
  },
  descriptionInput: {
    minHeight: 80,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    width: '48%',
  },
  dateTimeText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 8,
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