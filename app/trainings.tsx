import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp, Training } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TrainingItem({ item, isAdmin, onDelete }: { item: Training; isAdmin: boolean; onDelete?: () => void }) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push({ pathname: '/training/[id]', params: { id: item.id } })}
      activeOpacity={0.75}
    >
      <View style={styles.itemIcon}>
        <Ionicons name="document-text-outline" size={28} color={Colors.primary} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDate}>Eklenme Tarihi: {item.date}</Text>
      </View>
      <View style={styles.itemRight}>
        {item.isRead ? (
          <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
        ) : (
          <Ionicons name="chevron-forward" size={22} color={Colors.textSecondary} />
        )}
        {isAdmin && (
          <TouchableOpacity onPress={onDelete} style={{ marginTop: 4 }}>
            <Ionicons name="trash-outline" size={18} color={Colors.danger} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function TrainingsScreen() {
  const { trainings, deleteTraining, user } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const isAdmin = user?.role === 'admin';

  function handleDelete(id: string) {
    Alert.alert('Sil', 'Bu eğitimi silmek istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => deleteTraining(id) },
    ]);
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Eğitimlerim"
        showBack
        rightElement={isAdmin ? (
          <TouchableOpacity onPress={() => router.push('/training-add')} style={{ padding: 4, marginRight: 4 }}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        ) : undefined}
      />

      <FlatList
        data={trainings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TrainingItem
            item={item}
            isAdmin={isAdmin}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 20 }]}
        scrollEnabled={!!trainings.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>Henüz eğitim eklenmemiş</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, gap: 10 },
  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card, borderRadius: 14, padding: 14,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2, gap: 12,
  },
  itemIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primaryBg, justifyContent: 'center', alignItems: 'center',
  },
  itemContent: { flex: 1 },
  itemTitle: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: Colors.text, marginBottom: 4 },
  itemDate: { fontFamily: 'Nunito_400Regular', fontSize: 11, color: Colors.textLight },
  itemRight: { alignItems: 'center', gap: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 16 },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: Colors.textSecondary },
});
