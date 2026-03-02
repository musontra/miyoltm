import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Switch, Alert, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [username, setUsername] = useState(user?.username ?? '');
  const [name, setName] = useState(user?.name ?? '');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [fontSize, setFontSize] = useState(user?.fontSize ?? 14);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (password && password !== passwordConfirm) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }
    const updates: any = { name, bio, fontSize };
    if (password) updates.password = password;
    updateProfile(updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDeleteAll() {
    Alert.alert(
      'Tüm Verileri Sil',
      'Tüm verileriniz silinecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  }

  const themes = ['#C8391D', '#2563EB', '#059669', '#7C3AED', '#D97706'];

  return (
    <View style={styles.container}>
      <AppHeader title="Profil" showBack showHome />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={48} color={Colors.primary} />
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>RESMİ DEĞİŞTİR</Text>
          </TouchableOpacity>
          {user?.role === 'admin' && (
            <TouchableOpacity style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>YÖNETİCİ / PAROLA KANALIZI</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Kullanıcı Adı</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={Colors.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                value={username}
                editable={false}
                placeholder="Kullanıcı Adı"
                placeholderTextColor={Colors.textLight}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Şifre</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Yeni Şifre"
                placeholderTextColor={Colors.textLight}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Şifre Tekrar</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                placeholder="Şifre Tekrar"
                placeholderTextColor={Colors.textLight}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity style={styles.updateBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.updateBtnText}>{saved ? 'KAYDEDİLDİ' : 'GÜNCELLE'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kendinle İlgili Bir Şeyler Yaz</Text>
          <TextInput
            style={styles.textArea}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            placeholder="Kendinizden bahsedin..."
            placeholderTextColor={Colors.textLight}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>KAYDET</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Yazı Boyutu</Text>
          <View style={styles.fontSizeRow}>
            <TouchableOpacity onPress={() => setFontSize(s => Math.max(10, s - 2))} style={styles.fontBtn}>
              <Ionicons name="remove" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.fontSizeLabel, { fontSize }]}>{fontSize}pt</Text>
            <TouchableOpacity onPress={() => setFontSize(s => Math.min(22, s + 2))} style={styles.fontBtn}>
              <Ionicons name="add" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tema Seçimi</Text>
          <View style={styles.themeRow}>
            {themes.map(color => (
              <TouchableOpacity
                key={color}
                style={[styles.themeCircle, { backgroundColor: color }]}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAll} activeOpacity={0.85}>
          <Text style={styles.deleteBtnText}>TÜM VERİLERİ SİL</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, gap: 16 },
  avatarSection: { alignItems: 'center', paddingVertical: 20 },
  avatarCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.primaryBg, justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: Colors.primary,
    marginBottom: 12,
  },
  changePhotoBtn: {
    backgroundColor: Colors.primary, borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 8, marginBottom: 8,
  },
  changePhotoText: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: '#fff' },
  adminBadge: {
    backgroundColor: Colors.primaryBg, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 6,
  },
  adminBadgeText: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, color: Colors.primary },
  card: {
    backgroundColor: Colors.card, borderRadius: 14, padding: 16,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    gap: 12,
  },
  sectionTitle: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: Colors.text },
  field: { gap: 6 },
  label: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: Colors.textSecondary },
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
  updateBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
  },
  updateBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#fff' },
  textArea: {
    backgroundColor: Colors.inputBg, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border,
    padding: 12, fontFamily: 'Nunito_400Regular', fontSize: 14,
    color: Colors.text, minHeight: 80, textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
  },
  saveBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#fff' },
  fontSizeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24,
  },
  fontBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primaryBg, justifyContent: 'center', alignItems: 'center',
  },
  fontSizeLabel: { fontFamily: 'Nunito_700Bold', color: Colors.text, minWidth: 50, textAlign: 'center' },
  themeRow: { flexDirection: 'row', gap: 12, paddingVertical: 4 },
  themeCircle: {
    width: 32, height: 32, borderRadius: 16,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
  },
  deleteBtn: {
    backgroundColor: Colors.danger, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
    shadowColor: Colors.danger, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  deleteBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#fff' },
});
