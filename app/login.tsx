import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/colors';

export default function LoginScreen() {
  const { login } = useApp();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setError('Kullanıcı adı ve şifre gereklidir.');
      return;
    }
    const ok = login(username.trim(), password);
    if (ok) {
      router.replace('/home');
    } else {
      setError('Kullanıcı adı veya şifre hatalı.');
    }
  }

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: topPad + 20 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="medical" size={40} color="#fff" />
          </View>
          <Text style={styles.uni}>DOKUZ EYLÜL ÜNİVERSİTESİ</Text>
          <Text style={styles.faculty}>HEMŞİRELİK FAKÜLTESİ</Text>
          <Text style={styles.appName}>MULTİPL MİYELOM</Text>
          <Text style={styles.appSub}>MOBİL UYGULAMASI</Text>
        </View>

        <View style={styles.form}>
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Kullanıcı Adı"
              placeholderTextColor={Colors.textLight}
              value={username}
              onChangeText={t => { setUsername(t); setError(''); }}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Şifre"
              placeholderTextColor={Colors.textLight}
              value={password}
              onChangeText={t => { setPassword(t); setError(''); }}
              secureTextEntry={!showPass}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.loginBtnText}>GİRİŞ YAP</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/register')} style={styles.registerLink}>
            <Text style={styles.registerLinkText}>Hesabınız yok mu? <Text style={styles.registerLinkBold}>Kayıt Ol</Text></Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            Bu uygulama deneme aşamasında olduğu için tüm kullanıcılara açık değildir, anlayışınız için teşekkür ederiz.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 36 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  uni: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: Colors.primary, textAlign: 'center' },
  faculty: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: Colors.textSecondary, textAlign: 'center', marginBottom: 8 },
  appName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 18, color: Colors.text, textAlign: 'center' },
  appSub: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  form: { gap: 12 },
  errorBox: {
    backgroundColor: '#FEE2E2', borderRadius: 8, padding: 12,
    borderLeftWidth: 3, borderLeftColor: Colors.danger,
  },
  errorText: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: Colors.danger },
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
  eyeBtn: { padding: 4 },
  loginBtn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 4,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  loginBtnText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#fff', letterSpacing: 1 },
  registerLink: { alignItems: 'center', paddingVertical: 8 },
  registerLinkText: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.textSecondary },
  registerLinkBold: { fontFamily: 'Nunito_700Bold', color: Colors.primary },
  note: {
    fontFamily: 'Nunito_400Regular', fontSize: 11,
    color: Colors.textLight, textAlign: 'center', lineHeight: 16, marginTop: 8,
  },
});
