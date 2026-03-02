import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MODULES = [
  'Modül Seçiniz', 'Günlüğüm', 'Beslenme ve Egzersiz',
  'Eğitimlerim', 'Bilgi Paylaşımı', 'Öneriler', 'Görüşlerim',
];

export default function RemindersAddScreen() {
  const { addReminder } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [module, setModule] = useState('Modül Seçiniz');
  const [showModulePicker, setShowModulePicker] = useState(false);
  const [error, setError] = useState('');

  function handleSend() {
    if (!title.trim()) {
      setError('Hatırlatma başlığı gereklidir.');
      return;
    }
    addReminder({ title: title.trim(), detail: detail.trim(), module });
    router.back();
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Hatırlatma Ekle" showBack />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]}>
        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Hatırlatma Başlığı</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={t => { setTitle(t); setError(''); }}
              placeholder="Başlık girin..."
              placeholderTextColor={Colors.textLight}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Hatırlatma Detayı</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={detail}
              onChangeText={setDetail}
              placeholder="Detay girin..."
              placeholderTextColor={Colors.textLight}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>İlgili Modül</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowModulePicker(v => !v)}
            >
              <Text style={styles.pickerText}>{module}</Text>
              <Ionicons name={showModulePicker ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
            {showModulePicker && (
              <View style={styles.pickerOptions}>
                {MODULES.map(m => (
                  <TouchableOpacity
                    key={m}
                    style={styles.pickerOption}
                    onPress={() => { setModule(m); setShowModulePicker(false); }}
                  >
                    <Text style={[styles.pickerOptionText, m === module && { color: Colors.primary, fontFamily: 'Nunito_700Bold' }]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Text style={styles.note}>
            Not: Atamanızı gönderdikten sonra bildirim olarak iletilecektir. Hangi modüle atamanız gerektiğini seçiniz.
          </Text>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.85}>
            <Text style={styles.sendBtnText}>GÖNDER</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  card: {
    backgroundColor: Colors.card, borderRadius: 14, padding: 16,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, gap: 16,
  },
  field: { gap: 8 },
  label: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: Colors.text },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border,
    padding: 12, fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  picker: {
    backgroundColor: Colors.inputBg, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border,
    padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  pickerText: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text },
  pickerOptions: {
    backgroundColor: Colors.card, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  pickerOption: { padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  pickerOptionText: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text },
  note: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  error: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: Colors.danger },
  sendBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 14, alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  sendBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#fff', letterSpacing: 1 },
});
