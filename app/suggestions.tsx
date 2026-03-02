import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  TextInput, Modal, Platform, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, Suggestion } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SuggestionItem({ item, onLike, onDislike, userId }: {
  item: Suggestion; onLike: () => void; onDislike: () => void; userId: string;
}) {
  const liked = item.likedBy.includes(userId);
  const disliked = item.dislikedBy.includes(userId);

  return (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>admin</Text>
        </View>
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
      <Text style={styles.itemContent}>{item.content}</Text>
      {!!item.link && (
        <TouchableOpacity onPress={() => item.link && Linking.openURL(item.link)}>
          <Text style={styles.linkText}>{item.link}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.reactions}>
        <TouchableOpacity style={[styles.reactionBtn, liked && styles.reactionBtnActive]} onPress={onLike}>
          <Ionicons name="thumbs-up" size={16} color={liked ? Colors.success : Colors.textSecondary} />
          <Text style={[styles.reactionCount, liked && { color: Colors.success }]}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.reactionBtn, disliked && styles.reactionBtnDanger]} onPress={onDislike}>
          <Ionicons name="thumbs-down" size={16} color={disliked ? Colors.danger : Colors.textSecondary} />
          <Text style={[styles.reactionCount, disliked && { color: Colors.danger }]}>{item.dislikes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SuggestionsScreen() {
  const { suggestions, addSuggestion, likeSuggestion, user } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newLink, setNewLink] = useState('');

  const isAdmin = user?.role === 'admin';

  function handleAdd() {
    if (!newContent.trim()) return;
    addSuggestion(newContent.trim(), newLink.trim() || undefined);
    setNewContent('');
    setNewLink('');
    setShowAdd(false);
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Öneriler"
        showBack
        rightElement={isAdmin ? (
          <TouchableOpacity onPress={() => setShowAdd(true)} style={{ padding: 4, marginRight: 4 }}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        ) : undefined}
      />

      <FlatList
        data={suggestions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <SuggestionItem
            item={item}
            onLike={() => likeSuggestion(item.id, 'like')}
            onDislike={() => likeSuggestion(item.id, 'dislike')}
            userId={user?.id ?? ''}
          />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 20 }]}
        scrollEnabled={!!suggestions.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bulb-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>Henüz öneri yok</Text>
          </View>
        }
      />

      {isAdmin && (
        <View style={[styles.bottomBar, { paddingBottom: bottomPad + 8 }]}>
          <TextInput
            style={styles.bottomInput}
            placeholder="Öneri paylaş..."
            placeholderTextColor={Colors.textLight}
            value={newContent}
            onChangeText={setNewContent}
          />
          <TextInput
            style={[styles.bottomInput, { flex: 0.6 }]}
            placeholder="Link Paylaş"
            placeholderTextColor={Colors.textLight}
            value={newLink}
            onChangeText={setNewLink}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleAdd}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, gap: 12 },
  item: {
    backgroundColor: Colors.card, borderRadius: 14, padding: 16,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2, gap: 10,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  adminBadge: {
    backgroundColor: Colors.primaryBg, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  adminBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: Colors.primary },
  itemDate: { fontFamily: 'Nunito_400Regular', fontSize: 11, color: Colors.textLight },
  itemContent: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text, lineHeight: 22 },
  linkText: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: Colors.info },
  reactions: { flexDirection: 'row', gap: 12, paddingTop: 4 },
  reactionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.inputBg, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  reactionBtnActive: { borderColor: Colors.success, backgroundColor: '#F0FDF4' },
  reactionBtnDanger: { borderColor: Colors.danger, backgroundColor: '#FEF2F2' },
  reactionCount: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: Colors.textSecondary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 16 },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: Colors.textSecondary },
  bottomBar: {
    backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border,
    paddingHorizontal: 12, paddingTop: 10, flexDirection: 'row', gap: 8, alignItems: 'center',
  },
  bottomInput: {
    flex: 1, backgroundColor: Colors.inputBg, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text,
    borderWidth: 1, borderColor: Colors.border,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
});
