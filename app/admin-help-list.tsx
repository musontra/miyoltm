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

export default function AdminHelpListScreen() {
  const { users, getMessagesForUser } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const patientUsers = users.filter(u => u.role !== 'admin');

  return (
    <View style={styles.container}>
      <AppHeader title="Yardım" showBack />

      <FlatList
        data={patientUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const msgs = getMessagesForUser(item.id);
          const lastMsg = msgs[msgs.length - 1];
          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push({ pathname: '/admin-help/[userId]', params: { userId: item.id } })}
              activeOpacity={0.75}
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={22} color={Colors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.username}</Text>
                {lastMsg ? (
                  <Text style={styles.lastMsg} numberOfLines={1}>{lastMsg.content}</Text>
                ) : (
                  <Text style={styles.noMsg}>Mesaj yok</Text>
                )}
              </View>
              <View style={styles.right}>
                <Text style={[styles.status, { color: msgs.length > 0 ? Colors.success : Colors.textLight }]}>
                  {msgs.length > 0 ? 'Okundu' : 'Boş Mesaj'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 20 }]}
        scrollEnabled
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={64} color={Colors.border} />
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
    backgroundColor: Colors.card, borderRadius: 12, padding: 14,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primaryBg, justifyContent: 'center', alignItems: 'center',
  },
  info: { flex: 1 },
  name: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: Colors.text },
  lastMsg: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  noMsg: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: Colors.textLight, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  status: { fontFamily: 'Nunito_600SemiBold', fontSize: 11 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 16 },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: Colors.textSecondary },
});
