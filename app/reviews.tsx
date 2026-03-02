import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, Review } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <Ionicons
            name={star <= value ? 'star' : 'star-outline'}
            size={36}
            color={star <= value ? Colors.warning : Colors.border}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ReviewItem({ item }: { item: Review }) {
  return (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewUsername}>{item.username}</Text>
      <View style={styles.reviewRight}>
        <Text style={styles.reviewRating}>{item.rating}</Text>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
    </View>
  );
}

export default function ReviewsScreen() {
  const { reviews, addReview, user } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const isAdmin = user?.role === 'admin';
  const userReview = reviews.find(r => r.userId === user?.id);
  const [selectedRating, setSelectedRating] = useState(userReview?.rating ?? 0);
  const [saved, setSaved] = useState(false);

  const avg = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
    : '0.00';

  function handleSave() {
    if (selectedRating === 0) return;
    addReview(selectedRating);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (isAdmin) {
    return (
      <View style={styles.container}>
        <AppHeader title="Görüşler" showBack />
        <FlatList
          data={reviews}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ReviewItem item={item} />}
          contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 20 }]}
          ListHeaderComponent={
            <View style={styles.adminHeader}>
              <View style={styles.headerRow}>
                <Text style={styles.headerLabel}>Kullanıcı Adı</Text>
                <Text style={styles.headerLabel}>Verilen Oy</Text>
                <Text style={styles.headerLabel}>Tarih</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="star-outline" size={64} color={Colors.border} />
              <Text style={styles.emptyText}>Henüz görüş yok</Text>
            </View>
          }
          ListFooterComponent={
            reviews.length > 0 ? (
              <Text style={styles.avgText}>Ortalama Değerlendirme Puanı: {avg}</Text>
            ) : null
          }
          scrollEnabled
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: bottomPad + 20 }]}>
      <AppHeader title="Görüşlerim" showBack />
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingTitle}>Bizi değerlendirin.</Text>
        <StarRating value={selectedRating} onChange={setSelectedRating} />
        <TouchableOpacity
          style={[styles.saveBtn, selectedRating === 0 && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={selectedRating === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>{saved ? 'KAYDEDİLDİ' : 'KAYDET'}</Text>
        </TouchableOpacity>
        {userReview && (
          <Text style={styles.previousRating}>Önceki değerlendirmeniz: {userReview.rating} yıldız</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, gap: 8 },
  adminHeader: {
    backgroundColor: Colors.primary, borderRadius: 10, padding: 12, marginBottom: 8,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  headerLabel: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#fff', flex: 1, textAlign: 'center' },
  reviewItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.card, borderRadius: 10, padding: 14,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  reviewUsername: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: Colors.primary, flex: 1 },
  reviewRight: { flexDirection: 'row', gap: 20, alignItems: 'center', flex: 2, justifyContent: 'flex-end' },
  reviewRating: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: Colors.text },
  reviewDate: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: Colors.textSecondary },
  avgText: {
    fontFamily: 'Nunito_700Bold', fontSize: 14, color: Colors.text,
    textAlign: 'center', paddingVertical: 16,
    backgroundColor: Colors.card, borderRadius: 10, margin: 8, padding: 14,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 16 },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: Colors.textSecondary },
  ratingContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24, padding: 24,
  },
  ratingTitle: { fontFamily: 'Nunito_700Bold', fontSize: 22, color: Colors.text },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingHorizontal: 48, paddingVertical: 14,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: '#fff' },
  previousRating: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.textSecondary },
});
