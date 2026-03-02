import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/colors';

export default function RegisterScreen() {
  const { register } = useApp();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  function handleRegister() {
    if (!name.trim() || !username.trim() || !password.trim()) {
      setError('Tüm alanları doldurunuz.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    if (password.length < 4) {
      setError('Şifre en az 4 karakter olmalıdır.');
      return;
    }
    const ok = register(username.trim(), password, name.trim());
    if (ok) {
      router.replace('/home');
    } else {
      setError('Bu kullanıcı adı zaten kullanılıyor.');
    }
  }

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: topPad + 20 }]} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Kayıt Ol</Text>
          <Text style={styles.subtitle}>Multipl Miyelom Takip Sistemi'ne hoş geldiniz, hesabınızı oluşturun.</Text>
        </View>

        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Ad Soyad</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                placeholderTextColor={Colors.textLight}
                value={name}
                onChangeText={t => { setName(t); setError(''); }}
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>E-posta / Kullanıcı Adı</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="kullaniciadi"
                placeholderTextColor={Colors.textLight}
                value={username}
                onChangeText={t => { setUsername(t); setError(''); }}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Şifre</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="••••••"
                placeholderTextColor={Colors.textLight}
                value={password}
                onChangeText={t => { setPassword(t); setError(''); }}
                secureTextEntry={!showPass}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPass(v => !v)}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={styles.label}>Şifre (Tekrar)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="••••••"
                placeholderTextColor={Colors.textLight}
                value={passwordConfirm}
                onChangeText={t => { setPasswordConfirm(t); setError(''); }}
                secureTextEntry={!showPass}
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} activeOpacity={0.85}>
            <Text style={styles.registerBtnText}>KAYIT OL</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Zaten bir hesabınız var mı? <Text style={styles.loginLinkBold}>Giriş Yapın</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { marginBottom: 8 },
  header: { marginBottom: 24 },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 28, color: Colors.primary, marginBottom: 8 },
  subtitle: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  errorBox: {
    backgroundColor: '#FEE2E2', borderRadius: 8, padding: 12,
    borderLeftWidth: 3, borderLeftColor: Colors.danger, marginBottom: 12,
  },
  errorText: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: Colors.danger },
  form: { gap: 16 },
  label: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: Colors.textSecondary, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 4,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1, fontFamily: 'Nunito_400Regular', fontSize: 15,
    color: Colors.text, paddingVertical: 12,
  },
  registerBtn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 4,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  registerBtnText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#fff', letterSpacing: 1 },
  loginLink: { alignItems: 'center', paddingVertical: 8 },
  loginLinkText: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.textSecondary },
  loginLinkBold: { fontFamily: 'Nunito_700Bold', color: Colors.primary },
});
