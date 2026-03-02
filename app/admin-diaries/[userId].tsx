import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput, Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp, DiaryEntry } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function DiaryCard({ item }: { item: DiaryEntry }) {
  const q = (v: boolean) => v ? 'Evet' : 'Hayır';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>Soru: {item.date}</Text>
        <Text style={styles.cardDate}>Cevap</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.question}>1. Gün içerisin de ağrınız oldu mu?</Text>
        <Text style={styles.answer}>{q(item.hasPain)}</Text>
      </View>
      {item.hasPain && (
        <View style={styles.row}>
          <Text style={styles.question}>Yaşadığınız ağrı için 0-10 puan arasında değerlendirme yapınız.</Text>
          <Text style={styles.answer}>{item.painLevel}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.question}>2. Gün içerisinde iştahsızlık yaşadınız mı?</Text>
        <Text style={styles.answer}>{q(item.appetiteLoss)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.question}>3. Gün içerisinde el, kol ve ayaklarınızda karıncalanma veya uyuşma hissettiniz mi?</Text>
        <Text style={styles.answer}>{q(item.limbNumbness)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.question}>4. Gün içerisinde kendinizi yorgun hissettiniz mi?</Text>
        <Text style={styles.answer}>{q(item.tiredEasily)}</Text>
      </View>
      {item.hasFatigue && (
        <View style={styles.row}>
          <Text style={styles.question}>Yaşadığınız yorgunluk için 0-10 puan arasında değerlendirme yapınız.</Text>
          <Text style={styles.answer}>{item.fatigueLevel}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.question}>5. Günün herhangi bir zamanında alışılmışın dışında bir durum hissettiniz mi?</Text>
        <Text style={styles.answer}>{q(item.unusualFeeling)}</Text>
      </View>
    </View>
  );
}

export default function AdminUserDiariesScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { users, diaryEntries } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const [search, setSearch] = useState('');

  const user = users.find(u => u.id === userId);
  const entries = diaryEntries.filter(e => e.userId === userId);
  const filtered = entries.filter(e => e.date.includes(search));

  return (
    <View style={styles.container}>
      <AppHeader title={`Günlükler: ${user?.username ?? ''}`} showBack />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <DiaryCard item={item} />}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 20 }]}
        ListHeaderComponent={
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color={Colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Tarihe göre ara..."
              placeholderTextColor={Colors.textLight}
            />
          </View>
        }
        scrollEnabled
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="journal-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>Günlük bulunamadı</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, gap: 12 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8,
  },
  searchInput: {
    flex: 1, fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text,
  },
  card: {
    backgroundColor: Colors.card, borderRadius: 12, overflow: 'hidden',
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: Colors.primaryBg, padding: 12,
  },
  cardDate: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: Colors.primary },
  row: {
    flexDirection: 'row', padding: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    gap: 12, alignItems: 'flex-start',
  },
  question: { flex: 1, fontFamily: 'Nunito_400Regular', fontSize: 12, color: Colors.text, lineHeight: 18 },
  answer: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: Colors.primary, minWidth: 40, textAlign: 'right' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 16 },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: Colors.textSecondary },
});
