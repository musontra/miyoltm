import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'patient';
  bio?: string;
  avatar?: string;
  fontSize: number;
  lastLogin?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  detail: string;
  module: string;
  date: string;
  userId: string;
}

export interface Training {
  id: string;
  title: string;
  content: string;
  subheadings: Array<{ subtitle: string; content: string }>;
  link?: string;
  date: string;
  isRead: boolean;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  date: string;
  hasPain: boolean;
  painLevel: number;
  hasFatigue: boolean;
  fatigueLevel: number;
  appetiteLoss: boolean;
  appetiteLossReason?: string;
  limbNumbness: boolean;
  tiredEasily: boolean;
  unusualFeeling: boolean;
}

export interface NutritionEntry {
  id: string;
  userId: string;
  date: string;
  vegetableSpoons: string;
  fruitSpoons: string;
  exerciseMinutes: string;
  exercises: string[];
  negativeAfterExercise: boolean;
  negativeFeeling?: string;
}

export interface KnowledgePost {
  id: string;
  title: string;
  author: string;
  authorId: string;
  content: string;
  likes: number;
  dislikes: number;
  date: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  content: string;
  date: string;
}

export interface Suggestion {
  id: string;
  author: string;
  content: string;
  link?: string;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  date: string;
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  date: string;
}

export interface HelpMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  fromAdmin: boolean;
  date: string;
}

interface AppContextValue {
  user: User | null;
  users: User[];
  reminders: Reminder[];
  trainings: Training[];
  diaryEntries: DiaryEntry[];
  nutritionEntries: NutritionEntry[];
  knowledgePosts: KnowledgePost[];
  comments: Comment[];
  suggestions: Suggestion[];
  reviews: Review[];
  helpMessages: HelpMessage[];
  isLoading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, password: string, name: string) => boolean;
  addUser: (username: string, password: string) => boolean;
  deleteUser: (id: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'userId' | 'date'>) => void;
  deleteReminder: (id: string) => void;
  addTraining: (training: Omit<Training, 'id' | 'date' | 'isRead'>) => void;
  deleteTraining: (id: string) => void;
  markTrainingRead: (id: string) => void;
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'userId' | 'date'>) => void;
  addNutritionEntry: (entry: Omit<NutritionEntry, 'id' | 'userId' | 'date'>) => void;
  addKnowledgePost: (post: Omit<KnowledgePost, 'id' | 'author' | 'authorId' | 'likes' | 'dislikes' | 'date'>) => void;
  deleteKnowledgePost: (id: string) => void;
  addComment: (postId: string, content: string) => void;
  likePost: (id: string, type: 'like' | 'dislike') => void;
  addSuggestion: (content: string, link?: string) => void;
  likeSuggestion: (id: string, type: 'like' | 'dislike') => void;
  addReview: (rating: number) => void;
  sendHelpMessage: (toUserId: string, content: string, fromAdmin: boolean) => void;
  getMessagesForUser: (userId: string) => HelpMessage[];
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEYS = {
  USERS: 'mm_users',
  CURRENT_USER_ID: 'mm_current_user_id',
  REMINDERS: 'mm_reminders',
  TRAININGS: 'mm_trainings',
  DIARY_ENTRIES: 'mm_diary_entries',
  NUTRITION_ENTRIES: 'mm_nutrition_entries',
  KNOWLEDGE_POSTS: 'mm_knowledge_posts',
  COMMENTS: 'mm_comments',
  SUGGESTIONS: 'mm_suggestions',
  REVIEWS: 'mm_reviews',
  HELP_MESSAGES: 'mm_help_messages',
};

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function formatDate(): string {
  const now = new Date();
  const d = now.toLocaleDateString('tr-TR');
  const t = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  return `${d} ${t}`;
}

const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  username: 'admin',
  password: 'admin123',
  name: 'Yönetici',
  role: 'admin',
  fontSize: 14,
  bio: '',
  createdAt: '01.01.2025 00:00',
  lastLogin: '',
};

const SAMPLE_TRAININGS: Training[] = [
  {
    id: 'tr-001',
    title: 'Multipl Miyelom Nedir?',
    content: 'Miyelom, kemik iliğindeki plazma hücrelerinin kanseri şeklinde tanımlanan bir hastalıktır. Multipl miyelom hastalarının yaklaşık %90\'ında tanı anında birden fazla tutulumu olması nedeniyle "Multipl miyelom" olarak adlandırılabilir.',
    subheadings: [
      { subtitle: 'Belirtiler', content: 'Hastalık bazı hastalarda yavaş gelişim gösterir. Başlıca belirtiler: kemik ağrısı, yorgunluk, tekrarlayan enfeksiyonlar ve böbrek sorunlarıdır.' },
      { subtitle: 'Tedavi', content: 'Hastalığın evresi ve hastanın genel durumuna göre kemoterapi, radyoterapi veya kök hücre nakli gibi tedavi seçenekleri uygulanabilir.' },
    ],
    link: '',
    date: '17.12.2024 13:35',
    isRead: false,
  },
  {
    id: 'tr-002',
    title: 'Ağrı Yönetimi-1',
    content: 'Multipl miyelomda ağrı yönetimi, yaşam kalitesini artırmak için kritik öneme sahiptir. Ağrınızı düzenli olarak değerlendirmeniz ve doktorunuza bildirmeniz önemlidir.',
    subheadings: [
      { subtitle: 'Ağrı Değerlendirme', content: '0-10 ölçeği kullanarak ağrınızı değerlendirin. Ağrının yeri, şiddeti ve özelliklerini not alın.' },
    ],
    link: '',
    date: '17.12.2024 13:35',
    isRead: false,
  },
  {
    id: 'tr-003',
    title: 'Yorgunluk Yönetimi-1',
    content: 'Kanser yorgunluğu, hastalığa veya tedaviye bağlı ortaya çıkan ve günlük aktiviteleri etkileyen sürekli bir bitkinlik hissidir.',
    subheadings: [
      { subtitle: 'Enerji Koruma', content: 'Günlük aktivitelerinizi planlarken dinlenme aralarını unutmayın. Enerjinizi öncelikli işler için saklayın.' },
    ],
    link: '',
    date: '17.12.2024 13:35',
    isRead: false,
  },
  {
    id: 'tr-004',
    title: 'İştahsızlık Yönetimi-1',
    content: 'Tedavi sürecinde iştahsızlık sık görülen bir yan etkidir. Beslenmenizi sürdürmek iyileşme için önemlidir.',
    subheadings: [],
    link: '',
    date: '17.12.2024 13:34',
    isRead: false,
  },
  {
    id: 'tr-005',
    title: 'Enfeksiyon Yönetimi-1',
    content: 'Multipl miyelom ve tedavisi bağışıklık sistemini zayıflatabilir. Enfeksiyondan korunma hayati öneme sahiptir.',
    subheadings: [
      { subtitle: 'Korunma Yöntemleri', content: 'Sık el yıkayın, kalabalık ortamlardan kaçının, grip aşısı yaptırın ve belirtiler çıktığında hemen doktorunuza başvurun.' },
    ],
    link: '',
    date: '17.12.2024 13:34',
    isRead: false,
  },
];

const SAMPLE_SUGGESTIONS: Suggestion[] = [
  {
    id: 'sg-001',
    author: 'admin',
    content: 'Bayram ziyaretlerinde dikkat etmemiz gerekenler:\nSosyal mesafemize dikkat edelim\nCok kalabalik ortamlarda uzun sure durmayalim\nHafta maske kullanalim\nSik sik ellerimizi yikakalim\nEvimize gelenlere kolonya ikram edelim\nKendimizi Enfeksiyondan koruyalim',
    link: '',
    likes: 7,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
    date: '07.06.2025 18:10',
  },
  {
    id: 'sg-002',
    author: 'admin',
    content: 'AILENIZ VE SEVDIKLERINIZLE MUTLU, SAGLIKLI VE HUZURLU BAYRAMLAR GECIRMENIZI DILIYORUZ',
    link: '',
    likes: 10,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
    date: '06.06.2025 22:09',
  },
  {
    id: 'sg-003',
    author: 'admin',
    content: 'Bu gece uyku meditasyonu ile uyuyalim',
    link: '',
    likes: 10,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
    date: '07.06.2025 19:17',
  },
];

const SAMPLE_KNOWLEDGE_POSTS: KnowledgePost[] = [
  {
    id: 'kp-001',
    title: 'Caliskan hastalar.',
    author: 'MM8',
    authorId: 'mm8-user',
    content: 'Tedavi surecinde duzenli egzersiz yapmanin onemi cok buyuk. Hafif tempolu yuruyusler bile gunluk yasam kalitenizi artirabilir.',
    likes: 8,
    dislikes: 0,
    date: '25.07.2025 18:00',
  },
  {
    id: 'kp-002',
    title: 'Yaz aylari ve yuzme',
    author: 'admin',
    authorId: 'admin-001',
    content: 'Yaz aylarinda serinlemek icin en cok tercih edilen yontemlerden biri de yuzmedir. Yuzme kemik sagligini iyi bir egzersizdir. Fakat ayni zamanda cok dikkat edilmesi gerekir.\n\nYuzme, oncelikle olarak daha iyi bir yuzme deneyimi planlari oneriliebilir.\nYuzmesi cok iyi biliyorsa da yine de yaninda birileri olmadan yokse.\nKayma ve dusme riskiniz oldugundan tek basiniza yuzmemeniz onerilmez.\nOzellikle enfeksiyon riski oldugundan higiereden emin olmadiginiz havuzlara gitmemelisiniz.\nYuzme esnasinda kendinizi korumay bilmeli, ani ve hizli hareketlerden kacinmasiniz.',
    likes: 12,
    dislikes: 0,
    date: '25.07.2025 22:44',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([DEFAULT_ADMIN]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [trainings, setTrainings] = useState<Training[]>(SAMPLE_TRAININGS);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [knowledgePosts, setKnowledgePosts] = useState<KnowledgePost[]>(SAMPLE_KNOWLEDGE_POSTS);
  const [comments, setComments] = useState<Comment[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(SAMPLE_SUGGESTIONS);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [helpMessages, setHelpMessages] = useState<HelpMessage[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [
        usersData,
        currentUserId,
        remindersData,
        trainingsData,
        diaryData,
        nutritionData,
        knowledgeData,
        commentsData,
        suggestionsData,
        reviewsData,
        helpData,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USERS),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID),
        AsyncStorage.getItem(STORAGE_KEYS.REMINDERS),
        AsyncStorage.getItem(STORAGE_KEYS.TRAININGS),
        AsyncStorage.getItem(STORAGE_KEYS.DIARY_ENTRIES),
        AsyncStorage.getItem(STORAGE_KEYS.NUTRITION_ENTRIES),
        AsyncStorage.getItem(STORAGE_KEYS.KNOWLEDGE_POSTS),
        AsyncStorage.getItem(STORAGE_KEYS.COMMENTS),
        AsyncStorage.getItem(STORAGE_KEYS.SUGGESTIONS),
        AsyncStorage.getItem(STORAGE_KEYS.REVIEWS),
        AsyncStorage.getItem(STORAGE_KEYS.HELP_MESSAGES),
      ]);

      const savedUsers: User[] = usersData ? JSON.parse(usersData) : [DEFAULT_ADMIN];
      const hasAdmin = savedUsers.find(u => u.role === 'admin');
      const finalUsers = hasAdmin ? savedUsers : [DEFAULT_ADMIN, ...savedUsers];
      setUsers(finalUsers);

      if (currentUserId) {
        const foundUser = finalUsers.find(u => u.id === currentUserId);
        if (foundUser) setUser(foundUser);
      }

      if (remindersData) setReminders(JSON.parse(remindersData));
      if (trainingsData) setTrainings(JSON.parse(trainingsData));
      else setTrainings(SAMPLE_TRAININGS);
      if (diaryData) setDiaryEntries(JSON.parse(diaryData));
      if (nutritionData) setNutritionEntries(JSON.parse(nutritionData));
      if (knowledgeData) setKnowledgePosts(JSON.parse(knowledgeData));
      else setKnowledgePosts(SAMPLE_KNOWLEDGE_POSTS);
      if (commentsData) setComments(JSON.parse(commentsData));
      if (suggestionsData) setSuggestions(JSON.parse(suggestionsData));
      else setSuggestions(SAMPLE_SUGGESTIONS);
      if (reviewsData) setReviews(JSON.parse(reviewsData));
      if (helpData) setHelpMessages(JSON.parse(helpData));
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveUsers(newUsers: User[]) {
    setUsers(newUsers);
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));
  }

  function login(username: string, password: string): boolean {
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      const updated = { ...found, lastLogin: formatDate() };
      setUser(updated);
      const newUsers = users.map(u => u.id === found.id ? updated : u);
      saveUsers(newUsers);
      AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, found.id);
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
    AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  }

  function register(username: string, password: string, name: string): boolean {
    if (users.find(u => u.username === username)) return false;
    const newUser: User = {
      id: generateId(),
      username,
      password,
      name,
      role: 'patient',
      fontSize: 14,
      bio: '',
      createdAt: formatDate(),
      lastLogin: formatDate(),
    };
    const newUsers = [...users, newUser];
    saveUsers(newUsers);
    setUser(newUser);
    AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    return true;
  }

  function addUser(username: string, password: string): boolean {
    if (users.find(u => u.username === username)) return false;
    const newUser: User = {
      id: generateId(),
      username,
      password,
      name: username,
      role: 'patient',
      fontSize: 14,
      bio: '',
      createdAt: formatDate(),
    };
    saveUsers([...users, newUser]);
    return true;
  }

  function deleteUser(id: string) {
    saveUsers(users.filter(u => u.id !== id));
  }

  function updateProfile(updates: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    const newUsers = users.map(u => u.id === user.id ? updated : u);
    saveUsers(newUsers);
  }

  async function addReminder(reminder: Omit<Reminder, 'id' | 'userId' | 'date'>) {
    if (!user) return;
    const newReminder: Reminder = {
      ...reminder,
      id: generateId(),
      userId: user.id,
      date: formatDate(),
    };
    const newReminders = [newReminder, ...reminders];
    setReminders(newReminders);
    await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(newReminders));
  }

  async function deleteReminder(id: string) {
    const newReminders = reminders.filter(r => r.id !== id);
    setReminders(newReminders);
    await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(newReminders));
  }

  async function addTraining(training: Omit<Training, 'id' | 'date' | 'isRead'>) {
    const newTraining: Training = {
      ...training,
      id: generateId(),
      date: formatDate(),
      isRead: false,
    };
    const newTrainings = [newTraining, ...trainings];
    setTrainings(newTrainings);
    await AsyncStorage.setItem(STORAGE_KEYS.TRAININGS, JSON.stringify(newTrainings));
  }

  async function deleteTraining(id: string) {
    const newTrainings = trainings.filter(t => t.id !== id);
    setTrainings(newTrainings);
    await AsyncStorage.setItem(STORAGE_KEYS.TRAININGS, JSON.stringify(newTrainings));
  }

  async function markTrainingRead(id: string) {
    const newTrainings = trainings.map(t => t.id === id ? { ...t, isRead: true } : t);
    setTrainings(newTrainings);
    await AsyncStorage.setItem(STORAGE_KEYS.TRAININGS, JSON.stringify(newTrainings));
  }

  async function addDiaryEntry(entry: Omit<DiaryEntry, 'id' | 'userId' | 'date'>) {
    if (!user) return;
    const newEntry: DiaryEntry = {
      ...entry,
      id: generateId(),
      userId: user.id,
      date: formatDate(),
    };
    const newEntries = [newEntry, ...diaryEntries];
    setDiaryEntries(newEntries);
    await AsyncStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(newEntries));
  }

  async function addNutritionEntry(entry: Omit<NutritionEntry, 'id' | 'userId' | 'date'>) {
    if (!user) return;
    const newEntry: NutritionEntry = {
      ...entry,
      id: generateId(),
      userId: user.id,
      date: formatDate(),
    };
    const newEntries = [newEntry, ...nutritionEntries];
    setNutritionEntries(newEntries);
    await AsyncStorage.setItem(STORAGE_KEYS.NUTRITION_ENTRIES, JSON.stringify(newEntries));
  }

  async function addKnowledgePost(post: Omit<KnowledgePost, 'id' | 'author' | 'authorId' | 'likes' | 'dislikes' | 'date'>) {
    if (!user) return;
    const newPost: KnowledgePost = {
      ...post,
      id: generateId(),
      author: user.username,
      authorId: user.id,
      likes: 0,
      dislikes: 0,
      date: formatDate(),
    };
    const newPosts = [newPost, ...knowledgePosts];
    setKnowledgePosts(newPosts);
    await AsyncStorage.setItem(STORAGE_KEYS.KNOWLEDGE_POSTS, JSON.stringify(newPosts));
  }

  async function deleteKnowledgePost(id: string) {
    const newPosts = knowledgePosts.filter(p => p.id !== id);
    setKnowledgePosts(newPosts);
    await AsyncStorage.setItem(STORAGE_KEYS.KNOWLEDGE_POSTS, JSON.stringify(newPosts));
  }

  async function addComment(postId: string, content: string) {
    if (!user) return;
    const newComment: Comment = {
      id: generateId(),
      postId,
      author: user.username,
      authorId: user.id,
      content,
      date: formatDate(),
    };
    const newComments = [...comments, newComment];
    setComments(newComments);
    await AsyncStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(newComments));
  }

  async function likePost(id: string, type: 'like' | 'dislike') {
    const newPosts = knowledgePosts.map(p => {
      if (p.id !== id) return p;
      return type === 'like' ? { ...p, likes: p.likes + 1 } : { ...p, dislikes: p.dislikes + 1 };
    });
    setKnowledgePosts(newPosts);
    await AsyncStorage.setItem(STORAGE_KEYS.KNOWLEDGE_POSTS, JSON.stringify(newPosts));
  }

  async function addSuggestion(content: string, link?: string) {
    const newSuggestion: Suggestion = {
      id: generateId(),
      author: 'admin',
      content,
      link,
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
      date: formatDate(),
    };
    const newSuggestions = [newSuggestion, ...suggestions];
    setSuggestions(newSuggestions);
    await AsyncStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(newSuggestions));
  }

  async function likeSuggestion(id: string, type: 'like' | 'dislike') {
    if (!user) return;
    const newSuggestions = suggestions.map(s => {
      if (s.id !== id) return s;
      if (type === 'like') {
        if (s.likedBy.includes(user.id)) return s;
        return { ...s, likes: s.likes + 1, likedBy: [...s.likedBy, user.id] };
      } else {
        if (s.dislikedBy.includes(user.id)) return s;
        return { ...s, dislikes: s.dislikes + 1, dislikedBy: [...s.dislikedBy, user.id] };
      }
    });
    setSuggestions(newSuggestions);
    await AsyncStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(newSuggestions));
  }

  async function addReview(rating: number) {
    if (!user) return;
    const existingIdx = reviews.findIndex(r => r.userId === user.id);
    let newReviews: Review[];
    if (existingIdx >= 0) {
      newReviews = reviews.map(r => r.userId === user.id ? { ...r, rating, date: formatDate() } : r);
    } else {
      const newReview: Review = {
        id: generateId(),
        userId: user.id,
        username: user.username,
        rating,
        date: formatDate(),
      };
      newReviews = [newReview, ...reviews];
    }
    setReviews(newReviews);
    await AsyncStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(newReviews));
  }

  async function sendHelpMessage(toUserId: string, content: string, fromAdmin: boolean) {
    if (!user) return;
    const newMessage: HelpMessage = {
      id: generateId(),
      fromUserId: fromAdmin ? 'admin-001' : user.id,
      toUserId: fromAdmin ? toUserId : 'admin-001',
      content,
      fromAdmin,
      date: formatDate(),
    };
    const newMessages = [...helpMessages, newMessage];
    setHelpMessages(newMessages);
    await AsyncStorage.setItem(STORAGE_KEYS.HELP_MESSAGES, JSON.stringify(newMessages));
  }

  function getMessagesForUser(userId: string): HelpMessage[] {
    return helpMessages.filter(
      m => m.fromUserId === userId || m.toUserId === userId
    );
  }

  const value = useMemo(() => ({
    user, users, reminders, trainings, diaryEntries, nutritionEntries,
    knowledgePosts, comments, suggestions, reviews, helpMessages, isLoading,
    login, logout, register, addUser, deleteUser, updateProfile,
    addReminder, deleteReminder,
    addTraining, deleteTraining, markTrainingRead,
    addDiaryEntry, addNutritionEntry,
    addKnowledgePost, deleteKnowledgePost, addComment, likePost,
    addSuggestion, likeSuggestion,
    addReview,
    sendHelpMessage, getMessagesForUser,
  }), [user, users, reminders, trainings, diaryEntries, nutritionEntries,
    knowledgePosts, comments, suggestions, reviews, helpMessages, isLoading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
