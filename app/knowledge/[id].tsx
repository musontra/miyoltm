import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, FlatList, Platform, KeyboardAvoidingView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp, Comment } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        <Ionicons name="person" size={14} color={Colors.primary} />
      </View>
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{comment.author}</Text>
        <Text style={styles.commentText}>{comment.content}</Text>
        <Text style={styles.commentDate}>{comment.date}</Text>
      </View>
    </View>
  );
}

export default function KnowledgeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { knowledgePosts, comments, addComment, likePost, user } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [commentText, setCommentText] = useState('');

  const post = knowledgePosts.find(p => p.id === id);
  const postComments = comments.filter(c => c.postId === id);

  if (!post) {
    return (
      <View style={styles.container}>
        <AppHeader title="Bilgi Paylaşımı" showBack />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Paylaşım bulunamadı.</Text>
        </View>
      </View>
    );
  }

  function handleSendComment() {
    if (!commentText.trim()) return;
    addComment(id, commentText.trim());
    setCommentText('');
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AppHeader title="Bilgi Paylaşımı" showBack />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 80 }]}>
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.authorAvatar}>
              <Ionicons name="person" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.postAuthor}>{post.author}</Text>
              <Text style={styles.postDate}>{post.date}</Text>
            </View>
          </View>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent}>{post.content}</Text>

          <View style={styles.reactions}>
            <TouchableOpacity style={styles.reactionBtn} onPress={() => likePost(post.id, 'like')}>
              <Ionicons name="thumbs-up" size={18} color={Colors.success} />
              <Text style={styles.reactionCount}>{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reactionBtn} onPress={() => likePost(post.id, 'dislike')}>
              <Ionicons name="thumbs-down" size={18} color={Colors.danger} />
              <Text style={styles.reactionCount}>{post.dislikes}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.commentsTitle}>
          {postComments.length} Yorum
        </Text>

        {postComments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}

        {postComments.length === 0 && (
          <View style={styles.noComments}>
            <Text style={styles.noCommentsText}>Henüz yorum yok. İlk yorumu siz yapın!</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputBar, { paddingBottom: bottomPad + 8 }]}>
        <TextInput
          style={styles.commentInput}
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Yorumunuzu yazınız..."
          placeholderTextColor={Colors.textLight}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSendComment}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, gap: 12 },
  postCard: {
    backgroundColor: Colors.card, borderRadius: 14, padding: 16,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, gap: 12,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  authorAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primaryBg, justifyContent: 'center', alignItems: 'center',
  },
  postAuthor: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: Colors.text },
  postDate: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: Colors.textLight },
  postTitle: { fontFamily: 'Nunito_700Bold', fontSize: 17, color: Colors.text },
  postContent: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text, lineHeight: 22 },
  reactions: { flexDirection: 'row', gap: 16, paddingTop: 8 },
  reactionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.inputBg, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
  },
  reactionCount: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: Colors.text },
  commentsTitle: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: Colors.text, marginTop: 4 },
  commentItem: {
    flexDirection: 'row', gap: 10,
    backgroundColor: Colors.card, borderRadius: 12, padding: 12,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  commentAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primaryBg, justifyContent: 'center', alignItems: 'center',
  },
  commentContent: { flex: 1, gap: 2 },
  commentAuthor: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: Colors.text },
  commentText: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  commentDate: { fontFamily: 'Nunito_400Regular', fontSize: 11, color: Colors.textLight },
  noComments: { alignItems: 'center', padding: 20 },
  noCommentsText: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.textSecondary },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    backgroundColor: Colors.card, paddingHorizontal: 16, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  commentInput: {
    flex: 1, backgroundColor: Colors.inputBg, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text,
    maxHeight: 80, borderWidth: 1, borderColor: Colors.border,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: Colors.textSecondary },
});
