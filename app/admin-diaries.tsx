import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminDiariesScreen() {
  const { users } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const patientUsers = users.filter(u => u.role !== 'admin');

  return (
    <View style={styles.container}>
      <AppHeader title="Günlükler" showBack />

      <FlatList
        data={patientUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push({ pathname: '/admin-diaries/[userId]', params: { userId: item.id } })}
            activeOpacity={0.75}
          >
            <View style={styles.itemLeft}>
              <Ionicons name="journal-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.itemName}>{item.username}</Text>
            <Ionicons name="chevron-forward" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 20 }]}
        scrollEnabled
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="journal-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>Henüz kullanıcı yok</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, gap: 8 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.card, borderRadius: 12, padding: 16,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  itemLeft: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primaryBg, justifyContent: 'center', alignItems: 'center',
  },
  itemName: { flex: 1, fontFamily: 'Nunito_700Bold', fontSize: 15, color: Colors.primary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 16 },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: Colors.textSecondary },
});
