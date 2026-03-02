import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EXERCISE_OPTIONS = [
  'Egzersiz yapmadım',
  'Hafif tempolu yürüyüş',
  'Yüzme',
  'Sabit bisiklete binme',
  'Yoga',
  'Diğer',
];

const STEPS = [
  'vegetable',
  'fruit',
  'exerciseMinutes',
  'exerciseType',
  'negativeAfter',
];

export default function NutritionScreen() {
  const { addNutritionEntry } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [step, setStep] = useState(0);
  const [vegetableSpoons, setVegetableSpoons] = useState('');
  const [fruitSpoons, setFruitSpoons] = useState('');
  const [exerciseMinutes, setExerciseMinutes] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [negativeAfter, setNegativeAfter] = useState<'yes' | 'no' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function toggleExercise(exercise: string) {
    setSelectedExercises(prev =>
      prev.includes(exercise) ? prev.filter(e => e !== exercise) : [...prev, exercise]
    );
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      addNutritionEntry({
        vegetableSpoons,
        fruitSpoons,
        exerciseMinutes,
        exercises: selectedExercises,
        negativeAfterExercise: negativeAfter === 'yes',
      });
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <View style={styles.container}>
        <AppHeader title="Sağlıklı Yaşam ve Egzersiz" showBack />
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={48} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Kaydedildi</Text>
          <Text style={styles.successText}>Beslenme ve egzersiz bilgileriniz alındı.</Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
            <Text style={styles.doneBtnText}>Tamam</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.card}>
            <Text style={styles.question}>
              1. Bugün öğünlerinizde tükettiğiniz toplam sebze miktarını yemek kaşığı cinsinden belirtiniz. (Hiç sebze tüketmediyseniz '0' olarak belirtiniz.)
            </Text>
            <TextInput
              style={styles.input}
              value={vegetableSpoons}
              onChangeText={setVegetableSpoons}
              placeholder="Tükettiğiniz sebze kaşık miktarı"
              placeholderTextColor={Colors.textLight}
              keyboardType="numeric"
            />
          </View>
        );
      case 1:
        return (
          <View style={styles.card}>
            <Text style={styles.question}>
              2. Bugün öğünlerinizde tükettiğiniz toplam meyve miktarını yemek kaşığı cinsinden belirtiniz.
            </Text>
            <TextInput
              style={styles.input}
              value={fruitSpoons}
              onChangeText={setFruitSpoons}
              placeholder="Tükettiğiniz meyve kaşık miktarı"
              placeholderTextColor={Colors.textLight}
              keyboardType="numeric"
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.card}>
            <Text style={styles.question}>
              3. Bugün kaç dakika egzersiz yaptınız? (Hiç egzersiz yapmadıysanız '0' olarak belirtiniz.)
            </Text>
            <TextInput
              style={styles.input}
              value={exerciseMinutes}
              onChangeText={setExerciseMinutes}
              placeholder="Yapılan egzersiz dakikaları"
              placeholderTextColor={Colors.textLight}
              keyboardType="numeric"
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.card}>
            <Text style={styles.question}>
              4. Bugün hangi egzersizi yaptınız? (Birden fazla seçim yapabilirsiniz.)
            </Text>
            <View style={styles.checkboxList}>
              {EXERCISE_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.checkbox}
                  onPress={() => toggleExercise(option)}
                >
                  <View style={[styles.checkboxSquare, selectedExercises.includes(option) && styles.checkboxChecked]}>
                    {selectedExercises.includes(option) && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.card}>
            <Text style={styles.question}>
              5. Egzersiz yaptıktan sonra kendinizde olumsuz bir durum hissettiniz mi?
            </Text>
            <View style={styles.radioRow}>
              <TouchableOpacity
                style={[styles.radioBtn, negativeAfter === 'yes' && styles.radioBtnActive]}
                onPress={() => setNegativeAfter('yes')}
              >
                <View style={[styles.radioCircle, negativeAfter === 'yes' && styles.radioCircleActive]} />
                <Text style={[styles.radioLabel, negativeAfter === 'yes' && { color: Colors.primary }]}>Evet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioBtn, negativeAfter === 'no' && styles.radioBtnActive]}
                onPress={() => setNegativeAfter('no')}
              >
                <View style={[styles.radioCircle, negativeAfter === 'no' && styles.radioCircleActive]} />
                <Text style={[styles.radioLabel, negativeAfter === 'no' && { color: Colors.primary }]}>Hayır hissetmedim</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Sağlıklı Yaşam ve Egzersiz" showBack />
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%` }]} />
      </View>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]}>
        {renderStep()}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>{step < STEPS.length - 1 ? 'SONRAKİ SORU' : 'TAMAMLA'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  progressBar: { height: 4, backgroundColor: Colors.border },
  progressFill: { height: 4, backgroundColor: Colors.primary },
  scroll: { padding: 20, gap: 20 },
  card: {
    backgroundColor: Colors.card, borderRadius: 14, padding: 20,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, gap: 16,
  },
  question: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: Colors.text, lineHeight: 22 },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.primary,
    padding: 12, fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text,
  },
  checkboxList: { gap: 14 },
  checkbox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkboxSquare: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 2, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkboxLabel: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.text },
  radioRow: { flexDirection: 'row', gap: 24 },
  radioBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioCircle: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: Colors.border,
  },
  radioCircleActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  radioLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: Colors.textSecondary },
  nextBtn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  nextBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#fff', letterSpacing: 1 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, padding: 24 },
  successCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.success, justifyContent: 'center', alignItems: 'center',
  },
  successTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: Colors.text },
  successText: { fontFamily: 'Nunito_400Regular', fontSize: 15, color: Colors.textSecondary },
  doneBtn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingHorizontal: 40, paddingVertical: 14,
  },
  doneBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: '#fff' },
});
