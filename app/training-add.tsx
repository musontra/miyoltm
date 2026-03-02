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

export default function TrainingAddScreen() {
  const { addTraining } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [subheadings, setSubheadings] = useState([
    { subtitle: '', content: '' },
    { subtitle: '', content: '' },
    { subtitle: '', content: '' },
    { subtitle: '', content: '' },
    { subtitle: '', content: '' },
  ]);
  const [error, setError] = useState('');

  function updateSubheading(index: number, field: 'subtitle' | 'content', value: string) {
    const updated = [...subheadings];
    updated[index] = { ...updated[index], [field]: value };
    setSubheadings(updated);
  }

  function handleSave() {
    if (!title.trim()) {
      setError('Eğitim başlığı gereklidir.');
      return;
    }
    const filledSubheadings = subheadings.filter(s => s.subtitle.trim() || s.content.trim());
    addTraining({
      title: title.trim(),
      content: content.trim(),
      subheadings: filledSubheadings,
      link: link.trim(),
    });
    router.back();
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Eğitim Ekle" showBack />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]}>
        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Eğitim Başlığı</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={t => { setTitle(t); setError(''); }}
              placeholder="Başlık giriniz..."
              placeholderTextColor={Colors.textLight}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Eğitim İçeriği</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={content}
              onChangeText={setContent}
              placeholder="İçerik giriniz..."
              placeholderTextColor={Colors.textLight}
              multiline numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          {subheadings.map((sub, i) => (
            <React.Fragment key={i}>
              <View style={styles.field}>
                <Text style={styles.label}>Alt Başlık {i + 1}</Text>
                <TextInput
                  style={styles.input}
                  value={sub.subtitle}
                  onChangeText={v => updateSubheading(i, 'subtitle', v)}
                  placeholder={`Alt Başlık ${i + 1}`}
                  placeholderTextColor={Colors.textLight}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>İçerik {i + 1}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={sub.content}
                  onChangeText={v => updateSubheading(i, 'content', v)}
                  placeholder={`İçerik ${i + 1}`}
                  placeholderTextColor={Colors.textLight}
                  multiline numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </React.Fragment>
          ))}

          <View style={styles.field}>
            <Text style={styles.label}>Eğitim Linki</Text>
            <TextInput
              style={styles.input}
              value={link}
              onChangeText={setLink}
              placeholder="https://..."
              placeholderTextColor={Colors.textLight}
              autoCapitalize="none"
            />
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>EĞİTİM EKLE</Text>
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
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, gap: 14,
  },
  field: { gap: 6 },
  label: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: Colors.text },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border,
    padding: 12, fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  error: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: Colors.danger },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 14, alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#fff', letterSpacing: 1 },
});
