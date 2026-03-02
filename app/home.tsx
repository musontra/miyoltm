import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/colors';

interface Module {
  id: string;
  title: string;
  route: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

function ModuleCard({ mod }: { mod: Module }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(mod.route as any)}
      activeOpacity={0.78}
    >
      <View style={styles.cardIcon}>{mod.icon}</View>
      <Text style={styles.cardTitle}>{mod.title}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { user, logout } = useApp();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const isAdmin = user?.role === 'admin';

  const patientModules: Module[] = [
    {
      id: 'profile',
      title: 'PROFİLİM',
      route: '/profile',
      icon: <Ionicons name="person-circle-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'reminders',
      title: 'HATIRLATMALARIM',
      route: '/reminders',
      icon: <Ionicons name="notifications-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'trainings',
      title: 'EĞİTİMLERİM',
      route: '/trainings',
      icon: <Ionicons name="book-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'diary',
      title: 'GÜNLÜĞÜM',
      route: '/diary',
      icon: <Ionicons name="calendar-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'knowledge',
      title: 'BİLGİ PAYLAŞIMI',
      route: '/knowledge',
      icon: <Ionicons name="share-social-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'suggestions',
      title: 'ÖNERİLER',
      route: '/suggestions',
      icon: <Ionicons name="bulb-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'nutrition',
      title: 'BESLENME VE EGZERSİZ',
      route: '/nutrition',
      icon: <Ionicons name="barbell-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'reviews',
      title: 'GÖRÜŞLERİM',
      route: '/reviews',
      icon: <Ionicons name="star-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'help',
      title: 'YARDIM',
      route: '/help',
      icon: <Ionicons name="help-circle-outline" size={36} color={Colors.primary} />,
    },
  ];

  const adminModules: Module[] = [
    {
      id: 'admin-users',
      title: 'KULLANICI EKLE',
      route: '/admin-users',
      icon: <Ionicons name="person-add-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'profile',
      title: 'PROFİLİM',
      route: '/profile',
      icon: <Ionicons name="person-circle-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'reminders',
      title: 'HATIRLATMALAR',
      route: '/reminders',
      icon: <Ionicons name="notifications-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'trainings',
      title: 'EĞİTİMLER',
      route: '/trainings',
      icon: <Ionicons name="book-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'admin-records',
      title: 'KAYITLAR',
      route: '/admin-records',
      icon: <Ionicons name="document-text-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'admin-diaries',
      title: 'GÜNLÜKLER',
      route: '/admin-diaries',
      icon: <Ionicons name="journal-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'suggestions',
      title: 'ÖNERİLER',
      route: '/suggestions',
      icon: <Ionicons name="bulb-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'knowledge',
      title: 'BİLGİ PAYLAŞIMI',
      route: '/knowledge',
      icon: <Ionicons name="share-social-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'nutrition',
      title: 'BESLENME EGZERSİZ',
      route: '/nutrition',
      icon: <Ionicons name="barbell-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'reviews-admin',
      title: 'GÖRÜŞLERİ GÖR',
      route: '/reviews',
      icon: <Ionicons name="star-outline" size={36} color={Colors.primary} />,
    },
    {
      id: 'help-list',
      title: 'YARDIM',
      route: '/admin-help-list',
      icon: <Ionicons name="help-circle-outline" size={36} color={Colors.primary} />,
    },
  ];

  const modules = isAdmin ? adminModules : patientModules;

  return (
    <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}>
      <View style={styles.headerBg}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.push('/reminders')} style={styles.headerIcon}>
            <Ionicons name="time-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { logout(); router.replace('/login'); }} style={styles.headerIcon}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <View style={styles.logoCircle}>
            <Ionicons name="medical" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.headerUni}>DOKUZ EYLÜL ÜNİVERSİTESİ{'\n'}HEMŞİRELİK FAKÜLTESİ</Text>
          <Text style={styles.headerApp}>MULTİPL MİYELOM{'\n'}MOBİL UYGULAMASI</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        <View style={styles.gridInner}>
          {modules.map(mod => (
            <ModuleCard key={mod.id} mod={mod} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBtn} onPress={() => router.push('/reminders')}>
          <Ionicons name="chatbubble-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtnRed}>
          <Ionicons name="close-circle-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerBg: { backgroundColor: Colors.primary, paddingBottom: 20 },
  headerTop: {
    flexDirection: 'row', justifyContent: 'flex-end',
    paddingHorizontal: 16, paddingTop: 8, gap: 8,
  },
  headerIcon: { padding: 4 },
  headerContent: { alignItems: 'center', paddingTop: 8, paddingBottom: 8 },
  logoCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    marginBottom: 10,
  },
  headerUni: {
    fontFamily: 'Nunito_700Bold', fontSize: 11, color: '#fff',
    textAlign: 'center', lineHeight: 16, marginBottom: 4,
  },
  headerApp: {
    fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#fff',
    textAlign: 'center', lineHeight: 22,
  },
  grid: { padding: 16, paddingBottom: 24 },
  gridInner: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 20, paddingHorizontal: 12,
    alignItems: 'center', gap: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  cardIcon: { marginBottom: 4 },
  cardTitle: {
    fontFamily: 'Nunito_700Bold', fontSize: 11, color: Colors.text,
    textAlign: 'center', lineHeight: 16,
  },
  bottomBar: {
    backgroundColor: Colors.primary, flexDirection: 'row',
    justifyContent: 'center', gap: 24, paddingVertical: 10,
  },
  bottomBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  bottomBtnRed: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },
});
