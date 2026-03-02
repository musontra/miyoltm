import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  showHome?: boolean;
  rightElement?: React.ReactNode;
  onBack?: () => void;
}

export function AppHeader({ title, showBack = false, showHome = true, rightElement, onBack }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.inner}>
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity onPress={onBack ?? (() => router.back())} style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.right}>
          {rightElement}
          {showHome && (
            <TouchableOpacity onPress={() => router.replace('/home')} style={styles.iconBtn}>
              <Ionicons name="home" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#fff',
  },
  iconBtn: {
    padding: 4,
  },
});
