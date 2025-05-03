import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { PaperHeader } from '@/components/PaperHeader';
import { ListCard } from '@/components/ListCard';
import { CirclePlus as PlusCircle } from 'lucide-react-native';
import { PaperBackground } from '@/components/PaperBackground';
import { useListsStore } from '@/store/listsStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreateListModal } from '@/components/CreateListModal';

export default function ListsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lists, loadLists } = useListsStore();
  const [modalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const handleCreateList = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleListPress = useCallback((listId: string) => {
    router.push(`/list/${listId}`);
  }, [router]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return (
    <PaperBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <PaperHeader title="My Lists" />

        {lists.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No lists yet</Text>
            <Text style={styles.emptySubText}>
              Tap the + button to create your first list
            </Text>
          </View>
        ) : (
          <FlatList
            data={lists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListCard list={item} onPress={() => handleListPress(item.id)} />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}

        <TouchableOpacity style={styles.fab} onPress={handleCreateList}>
          <PlusCircle size={56} color={COLORS.primary} fill={COLORS.paperWhite} />
        </TouchableOpacity>

        <CreateListModal visible={modalVisible} onClose={closeModal} />
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