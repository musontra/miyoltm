import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  TextInput, Modal, Alert, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp, KnowledgePost } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function PostItem({ post, onPress, onDelete, canDelete }: {
  post: KnowledgePost; onPress: () => void; onDelete: () => void; canDelete: boolean;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.itemLeft}>
        <View style={styles.avatarCircle}>
          <Ionicons name="share-outline" size={20} color={Colors.primary} />
        </View>
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{post.title}</Text>
        <Text style={styles.itemAuthor}>{post.author}</Text>
        <View style={styles.itemStats}>
          <View style={styles.stat}>
            <Ionicons name="thumbs-up-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.statText}>{post.likes} beğeni</Text>
          </View>
        </View>
      </View>
      <View style={styles.itemRight}>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        {canDelete && (
          <TouchableOpacity onPress={onDelete} style={{ marginTop: 4 }}>
            <Ionicons name="trash-outline" size={16} color={Colors.danger} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function KnowledgeScreen() {
  const { knowledgePosts, deleteKnowledgePost, addKnowledgePost, user } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  function handleDelete(id: string) {
    Alert.alert('Sil', 'Bu paylaşımı silmek istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => deleteKnowledgePost(id) },
    ]);
  }

  function handleAdd() {
    if (!newTitle.trim() || !newContent.trim()) return;
    addKnowledgePost({ title: newTitle.trim(), content: newContent.trim() });
    setNewTitle('');
    setNewContent('');
    setShowAdd(false);
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Bilgi Paylaşımı"
        showBack
        rightElement={
          <TouchableOpacity onPress={() => setShowAdd(true)} style={{ padding: 4, marginRight: 4 }}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={knowledgePosts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            onPress={() => router.push({ pathname: '/knowledge/[id]', params: { id: item.id } })}
            onDelete={() => handleDelete(item.id)}
            canDelete={user?.role === 'admin' || item.authorId === user?.id}
          />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 20 }]}
        scrollEnabled={!!knowledgePosts.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="share-social-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>Henüz paylaşım yok</Text>
          </View>
        }
      />

      <Modal visible={showAdd} animationType="slide" transparent onRequestClose={() => setShowAdd(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Paylaşım</Text>
              <TouchableOpacity onPress={() => setShowAdd(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Başlık..."
              placeholderTextColor={Colors.textLight}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newContent}
              onChangeText={setNewContent}
              placeholder="İçerik..."
              placeholderTextColor={Colors.textLight}
              multiline numberOfLines={5}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>PAYLAŞ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, gap: 10 },
  item: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: Colors.card, borderRadius: 14, padding: 14,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2, gap: 12,
  },
  itemLeft: {},
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primaryBg, justifyContent: 'center', alignItems: 'center',
  },
  itemContent: { flex: 1 },
  itemTitle: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: Colors.text, marginBottom: 2 },
  itemAuthor: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: Colors.textSecondary, marginBottom: 6 },
  itemStats: { flexDirection: 'row', gap: 12 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: Colors.textSecondary },
  itemRight: { alignItems: 'center', gap: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 16 },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: Colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modal: {
    backgroundColor: Colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, gap: 14,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: Colors.text },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border,
    padding: 12, fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  addBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 14, alignItems: 'center',
  },
  addBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#fff' },
});
