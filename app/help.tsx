import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, HelpMessage } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MessageBubble({ message }: { message: HelpMessage }) {
  const isFromMe = !message.fromAdmin;
  return (
    <View style={[styles.bubble, isFromMe ? styles.bubbleRight : styles.bubbleLeft]}>
      <Text style={[styles.bubbleText, isFromMe && styles.bubbleTextRight]}>
        {message.content}
      </Text>
      <Text style={[styles.bubbleTime, isFromMe && { color: 'rgba(255,255,255,0.7)' }]}>
        {message.date}
      </Text>
    </View>
  );
}

export default function HelpScreen() {
  const { user, sendHelpMessage, getMessagesForUser, users } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [text, setText] = useState('');

  const messages = user ? getMessagesForUser(user.id) : [];

  function handleSend() {
    if (!text.trim() || !user) return;
    sendHelpMessage(user.id, text.trim(), false);
    setText('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppHeader title="Yardım" showBack />

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color={Colors.info} />
        <Text style={styles.infoText}>
          Bu modülü; kullanıcıya destek sağlamak ve uygulamayı etkili kullanmanız konusunda yardım için yöneticiye iletişim amacıyla kullanabilirsiniz.
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 80 }]}
        scrollEnabled
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>Henüz mesaj yok</Text>
            <Text style={styles.emptyNote}>Yöneticiye mesaj yazabilirsiniz.</Text>
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
  infoBox: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: '#EFF6FF', margin: 16, padding: 14,
    borderRadius: 12, borderLeftWidth: 3, borderLeftColor: Colors.info,
  },
  infoText: { flex: 1, fontFamily: 'Nunito_400Regular', fontSize: 13, color: Colors.text, lineHeight: 18 },
  list: { paddingHorizontal: 16, gap: 8 },
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
  bubbleText: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text },
  bubbleTextRight: { color: '#fff' },
  bubbleTime: { fontFamily: 'Nunito_400Regular', fontSize: 11, color: Colors.textLight },
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
