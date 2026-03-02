import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  TextInput, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, User } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function UserItem({ item, onDelete }: { item: User; onDelete: () => void }) {
  const avatarColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  const colorIdx = item.username.charCodeAt(0) % avatarColors.length;

  return (
    <View style={styles.userItem}>
      <View style={[styles.userAvatar, { backgroundColor: avatarColors[colorIdx] }]}>
        <Ionicons name="person" size={22} color="#fff" />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userDate}>Son Kullanıcı Girişi: {item.lastLogin ?? 'Hiç giriş yapmadı'}</Text>
      </View>
      {item.role !== 'admin' && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={20} color={Colors.danger} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function AdminUsersScreen() {
  const { users, addUser, deleteUser } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const patientUsers = users.filter(u => u.role !== 'admin');

  function handleAdd() {
    if (!newUsername.trim() || !newPassword.trim()) {
      setError('Kullanıcı adı ve şifre gereklidir.');
      return;
    }
    const ok = addUser(newUsername.trim(), newPassword.trim());
    if (ok) {
      setNewUsername('');
      setNewPassword('');
      setError('');
    } else {
      setError('Bu kullanıcı adı zaten kullanılıyor.');
    }
  }

  function handleDelete(id: string, name: string) {
    Alert.alert('Kullanıcıyı Sil', `"${name}" kullanıcısını silmek istediğinizden emin misiniz?`, [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => deleteUser(id) },
    ]);
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Kullanıcı Ekle" showBack />

      <FlatList
        data={patientUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <UserItem item={item} onDelete={() => handleDelete(item.id, item.username)} />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 20 }]}
        scrollEnabled
        ListHeaderComponent={
          <View style={styles.addCard}>
            <Text style={styles.sectionTitle}>Yeni Kullanıcı</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={Colors.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                value={newUsername}
                onChangeText={t => { setNewUsername(t); setError(''); }}
                placeholder="Kullanıcı Adı"
                placeholderTextColor={Colors.textLight}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={t => { setNewPassword(t); setError(''); }}
                placeholder="Şifre"
                placeholderTextColor={Colors.textLight}
                secureTextEntry
              />
            </View>
            {!!error && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.85}>
              <Text style={styles.addBtnText}>KAYDET</Text>
            </TouchableOpacity>
            {patientUsers.length > 0 && (
              <Text style={styles.listLabel}>Kullanıcılar ({patientUsers.length})</Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>Henüz kullanıcı yok</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, gap: 10 },
  addCard: {
    backgroundColor: Colors.card, borderRadius: 14, padding: 16,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, gap: 12, marginBottom: 8,
  },
  sectionTitle: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: Colors.text },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.inputBg, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  input: {
    flex: 1, fontFamily: 'Nunito_400Regular', fontSize: 14,
    color: Colors.text, paddingVertical: 10,
  },
  error: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: Colors.danger },
  addBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 13, alignItems: 'center',
  },
  addBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#fff' },
  listLabel: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  userItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card, borderRadius: 12, padding: 14,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1, gap: 12,
  },
  userAvatar: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  userInfo: { flex: 1 },
  userName: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: Colors.primary },
  userDate: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  deleteBtn: { padding: 6 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 12 },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: Colors.textSecondary },
});
