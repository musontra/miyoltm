import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp, HelpMessage } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MessageBubble({ message, isAdmin }: { message: HelpMessage; isAdmin: boolean }) {
  const isMyMessage = (isAdmin && message.fromAdmin) || (!isAdmin && !message.fromAdmin);

  return (
    <View style={[styles.bubble, isMyMessage ? styles.bubbleRight : styles.bubbleLeft]}>
      <Text style={[styles.bubbleText, isMyMessage && styles.bubbleTextRight]}>
        {message.content}
      </Text>
      <Text style={[styles.bubbleTime, isMyMessage && { color: 'rgba(255,255,255,0.7)' }]}>
        {message.date}
      </Text>
    </View>
  );
}

export default function AdminHelpScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { users, sendHelpMessage, getMessagesForUser, user } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [text, setText] = useState('');
  const targetUser = users.find(u => u.id === userId);
  const isAdmin = user?.role === 'admin';
  const messages = getMessagesForUser(userId);

  function handleSend() {
    if (!text.trim()) return;
    sendHelpMessage(userId, text.trim(), isAdmin);
    setText('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppHeader title={`Yardım: ${targetUser?.username ?? ''}`} showBack />

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MessageBubble message={item} isAdmin={isAdmin} />}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 80 }]}
        inverted={false}
        scrollEnabled
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>Henüz mesaj yok</Text>
            <Text style={styles.emptyNote}>Yardım için mesaj yazabilirsiniz.</Text>
          </View>
        }
      />

      <View style={[styles.inputBar, { paddingBottom: bottomPad + 8 }]}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Mesaj yaz..."
          placeholderTextColor={Colors.textLight}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, gap: 8 },
  bubble: {
    maxWidth: '80%', borderRadius: 16, padding: 12, gap: 4,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  bubbleLeft: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 4,
  },
  bubbleRight: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text, lineHeight: 20,
  },
  bubbleTextRight: { color: '#fff' },
  bubbleTime: {
    fontFamily: 'Nunito_400Regular', fontSize: 11, color: Colors.textLight,
  },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: Colors.textSecondary },
  emptyNote: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: Colors.textLight },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    backgroundColor: Colors.card, paddingHorizontal: 16, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  input: {
    flex: 1, backgroundColor: Colors.inputBg, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text,
    maxHeight: 80, borderWidth: 1, borderColor: Colors.border,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
});
