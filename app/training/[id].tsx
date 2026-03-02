import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TrainingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trainings, markTrainingRead } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const training = trainings.find(t => t.id === id);

  useEffect(() => {
    if (training && !training.isRead) {
      markTrainingRead(training.id);
    }
  }, [training?.id]);

  if (!training) {
    return (
      <View style={styles.container}>
        <AppHeader title="Eğitim" showBack />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Eğitim bulunamadı.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Eğitimlerim" showBack />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]}>
        <Text style={styles.mainTitle}>{training.title}</Text>

        <View style={styles.contentBlock}>
          <Text style={styles.bodyText}>{training.content}</Text>
        </View>

        {training.subheadings.filter(s => s.subtitle || s.content).map((sub, i) => (
          <View key={i} style={styles.section}>
            {!!sub.subtitle && <Text style={styles.subtitle}>{sub.subtitle}</Text>}
            {!!sub.content && <Text style={styles.bodyText}>{sub.content}</Text>}
          </View>
        ))}

        {!!training.link && (
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => Linking.openURL(training.link!)}
          >
            <Ionicons name="link-outline" size={18} color={Colors.info} />
            <Text style={styles.linkText}>{training.link}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.dateText}>Eklenme Tarihi: {training.date}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20 },
  mainTitle: {
    fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: Colors.text,
    marginBottom: 16, lineHeight: 32,
  },
  contentBlock: { marginBottom: 16 },
  bodyText: {
    fontFamily: 'Nunito_400Regular', fontSize: 15, color: Colors.text,
    lineHeight: 24,
  },
  section: { marginTop: 20, gap: 8 },
  subtitle: {
    fontFamily: 'Nunito_700Bold', fontSize: 17, color: Colors.primary, marginBottom: 4,
  },
  linkBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#EFF6FF', borderRadius: 10, padding: 12, marginTop: 16,
  },
  linkText: {
    fontFamily: 'Nunito_400Regular', fontSize: 13, color: Colors.info, flex: 1,
  },
  dateText: {
    fontFamily: 'Nunito_400Regular', fontSize: 12, color: Colors.textLight,
    marginTop: 24,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: Colors.textSecondary },
});
