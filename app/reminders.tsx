import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp, Reminder } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ReminderItem({ item, onDelete }: { item: Reminder; onDelete: () => void }) {
  return (
    <View style={styles.item}>
      <View style={styles.iconCol}>
        <View style={styles.bellCircle}>
          <Ionicons name="notifications" size={20} color={Colors.primary} />
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
        {!!item.detail && (
          <Text style={styles.itemDetail} numberOfLines={3}>{item.detail}</Text>
        )}
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={20} color={Colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

export default function RemindersScreen() {
  const { reminders, deleteReminder, user } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const myReminders = reminders.filter(r => r.userId === user?.id);

  function handleDelete(id: string) {
    Alert.alert('Sil', 'Bu hatırlatmayı silmek istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => deleteReminder(id) },
    ]);
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Hatırlatmalarım"
        showBack
        rightElement={
          <TouchableOpacity onPress={() => router.push('/reminders-add')} style={{ padding: 4, marginRight: 4 }}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={myReminders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ReminderItem item={item} onDelete={() => handleDelete(item.id)} />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 20 }]}
        scrollEnabled={!!myReminders.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>Henüz hatırlatma yok</Text>
            <TouchableOpacity onPress={() => router.push('/reminders-add')} style={styles.addBtn}>
              <Text style={styles.addBtnText}>Hatırlatma Ekle</Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 14, padding: 14,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    gap: 12, alignItems: 'flex-start',
  },
  iconCol: { paddingTop: 2 },
  bellCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primaryBg, justifyContent: 'center', alignItems: 'center',
  },
  content: { flex: 1, gap: 4 },
  itemTitle: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: Colors.text },
  itemDetail: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  itemDate: { fontFamily: 'Nunito_400Regular', fontSize: 11, color: Colors.textLight, marginTop: 2 },
  deleteBtn: { padding: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 16 },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: Colors.textSecondary },
  addBtn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  addBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#fff' },
});
