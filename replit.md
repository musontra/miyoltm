# Multipl Miyelom Mobil Uygulaması

A mobile healthcare application built with React Native (Expo) for the Dokuz Eylül Üniversitesi Hemşirelik Fakültesi.

## App Overview

Turkish-language mobile app for Multiple Myeloma patient management and education.

## Architecture

- **Frontend**: Expo + React Native + Expo Router (file-based routing)
- **Backend**: Express.js (port 5000) - serves API and landing page
- **Storage**: AsyncStorage (local data persistence)
- **State**: React Context (AppContext) + React Query

## Key Features

### Patient Modules
1. **Profilim** - User profile management, bio, font size, theme
2. **Hatırlatmalarım** - Notifications/reminders with add/delete
3. **Eğitimlerim** - Educational content with detailed view
4. **Günlüğüm** - Daily health questionnaire (pain/fatigue sliders, yes/no questions)
5. **Beslenme ve Egzersiz** - Nutrition & exercise daily tracking
6. **Bilgi Paylaşımı** - Knowledge sharing forum with likes/comments
7. **Öneriler** - Admin suggestions feed with reactions
8. **Görüşlerim** - Star rating and feedback
9. **Yardım** - Help chat with admin

### Admin Modules
- **Kullanıcı Ekle** - User management (add/delete patients)
- **Eğitimler** - Add/manage educational content
- **Kayıtlar** - View patient nutrition/exercise records per user
- **Günlükler** - View patient diary entries per user
- **Öneriler** - Post suggestions with links
- **Görüşler** - View all reviews with averages
- **Yardım** - Help chat with individual patients

## Default Credentials
- **Admin**: username=`admin`, password=`admin123`
- **Patients**: Register via the Register screen or admin creates via Kullanıcı Ekle

## Tech Stack
- Expo SDK 54
- expo-router v6 (file-based routing, Stack navigation)
- @tanstack/react-query (server state)
- @react-native-async-storage/async-storage (local persistence)
- @expo-google-fonts/nunito (typography)
- @react-native-community/slider (diary sliders)
- @expo/vector-icons (Ionicons)

## File Structure
```
app/
  _layout.tsx         # Root layout (fonts, providers)
  index.tsx           # Redirect to login or home
  login.tsx           # Login screen
  register.tsx        # Registration
  home.tsx            # Main dashboard grid
  profile.tsx         # User profile
  reminders.tsx       # Reminders list
  reminders-add.tsx   # Add reminder
  trainings.tsx       # Training list
  training-add.tsx    # Add training (admin)
  training/[id].tsx   # Training detail
  diary.tsx           # Daily health diary questionnaire
  nutrition.tsx       # Nutrition & exercise questionnaire
  knowledge.tsx       # Knowledge sharing forum
  knowledge/[id].tsx  # Post detail with comments
  suggestions.tsx     # Suggestions feed
  reviews.tsx         # Reviews (patient submit / admin view)
  help.tsx            # Patient help chat
  admin-users.tsx     # Admin user management
  admin-records.tsx   # Admin: list patients for nutrition records
  admin-records/[userId].tsx  # Patient nutrition records
  admin-diaries.tsx   # Admin: list patients for diaries
  admin-diaries/[userId].tsx  # Patient diary entries
  admin-help-list.tsx # Admin: list patients for help chat
  admin-help/[userId].tsx     # Admin help chat with patient

context/
  AppContext.tsx       # All app state (auth, data, actions)

components/
  AppHeader.tsx       # Reusable header component
  ErrorBoundary.tsx   # Error boundary
  ErrorFallback.tsx   # Error fallback UI

constants/
  colors.ts           # Color palette (red/orange theme)
```

## Colors
- Primary: #C8391D (deep red-orange)
- Background: #F4F4F6
- Cards: #FFFFFF
