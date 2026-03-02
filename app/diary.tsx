import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { AppHeader } from '@/components/AppHeader';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type YesNo = 'yes' | 'no' | null;

function YesNoQuestion({ question, value, onChange }: {
  question: string; value: YesNo; onChange: (v: YesNo) => void;
}) {
  return (
    <View style={styles.questionBlock}>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.radioRow}>
        <TouchableOpacity
          style={[styles.radioBtn, value === 'yes' && styles.radioBtnActive]}
          onPress={() => onChange('yes')}
        >
          <View style={[styles.radioCircle, value === 'yes' && styles.radioCircleActive]} />
          <Text style={[styles.radioLabel, value === 'yes' && styles.radioLabelActive]}>Evet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioBtn, value === 'no' && styles.radioBtnActive]}
          onPress={() => onChange('no')}
        >
          <View style={[styles.radioCircle, value === 'no' && styles.radioCircleActive]} />
          <Text style={[styles.radioLabel, value === 'no' && styles.radioLabelActive]}>Hayır</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const QUESTIONS = [
  { key: 'hasPain', label: '1. Gün içerisin de ağrınız oldu mu?' },
  { key: 'hasFatigue', label: '4. Gün içerisinde kendinizi yorgun hissettiniz mi?' },
  { key: 'appetiteLoss', label: '2. Gün içerisinde iştahsızlık yaşadınız mı?' },
  { key: 'limbNumbness', label: '3. Gün içerisinde el, kol ve ayaklarınızda karıncalanma veya uyuşma hissettiniz mi?' },
  { key: 'tiredEasily', label: '5. Gün içerisinde kendinizi yorgun hissettiniz mi?' },
  { key: 'unusualFeeling', label: '6. Günün herhangi bir zamanında alışılmışın dışında bir an ya da hissettiniz bir şey oldu mu?' },
];

export default function DiaryScreen() {
  const { addDiaryEntry } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [step, setStep] = useState(0);
  const [hasPain, setHasPain] = useState<YesNo>(null);
  const [painLevel, setPainLevel] = useState(0);
  const [hasFatigue, setHasFatigue] = useState<YesNo>(null);
  const [fatigueLevel, setFatigueLevel] = useState(0);
  const [appetiteLoss, setAppetiteLoss] = useState<YesNo>(null);
  const [limbNumbness, setLimbNumbness] = useState<YesNo>(null);
  const [tiredEasily, setTiredEasily] = useState<YesNo>(null);
  const [unusualFeeling, setUnusualFeeling] = useState<YesNo>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleNext() {
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      handleSubmit();
    }
  }

  function handleSubmit() {
    addDiaryEntry({
      hasPain: hasPain === 'yes',
      painLevel,
      hasFatigue: hasFatigue === 'yes',
      fatigueLevel,
      appetiteLoss: appetiteLoss === 'yes',
      limbNumbness: limbNumbness === 'yes',
      tiredEasily: tiredEasily === 'yes',
      unusualFeeling: unusualFeeling === 'yes',
    });
    setSubmitted(true);
  }

  const totalSteps = 6;

  if (submitted) {
    return (
      <View style={styles.container}>
        <AppHeader title="Günlüğüm" showBack />
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={48} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Günlük Tamamlandı</Text>
          <Text style={styles.successText}>Günlük kaydınız başarıyla alındı.</Text>
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
            <YesNoQuestion
              question="1. Gün içerisin de ağrınız oldu mu?"
              value={hasPain}
              onChange={setHasPain}
            />
            {hasPain === 'yes' && (
              <View style={styles.sliderBlock}>
                <Text style={styles.sliderLabel}>
                  Yaşadığınız ağrı için 0-10 puan arasında değerlendirme yapınız.
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={painLevel}
                  onValueChange={setPainLevel}
                  minimumTrackTintColor={Colors.primary}
                  maximumTrackTintColor={Colors.border}
                  thumbTintColor={Colors.primary}
                />
                <Text style={styles.sliderValue}>{painLevel}</Text>
              </View>
            )}
          </View>
        );
      case 1:
        return (
          <View style={styles.card}>
            <YesNoQuestion
              question="2. Gün içerisinde iştahsızlık yaşadınız mı?"
              value={appetiteLoss}
              onChange={setAppetiteLoss}
            />
            {appetiteLoss === 'yes' && (
              <View style={styles.subQuestion}>
                <Text style={styles.subLabel}>Size göre iştahsızlık yaşama sebebiniz nedir?</Text>
              </View>
            )}
          </View>
        );
      case 2:
        return (
          <View style={styles.card}>
            <YesNoQuestion
              question="3. Gün içerisinde el, kol ve ayaklarınızda karıncalanma veya uyuşma hissettiniz mi?"
              value={limbNumbness}
              onChange={setLimbNumbness}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.card}>
            <View style={styles.sliderBlock}>
              <Text style={styles.sliderLabel}>
                Yaşadığınız yorgunluk için 0-10 puan arasında değerlendirme yapınız.
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={fatigueLevel}
                onValueChange={setFatigueLevel}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.border}
                thumbTintColor={Colors.primary}
              />
              <Text style={styles.sliderValue}>{fatigueLevel}</Text>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.card}>
            <YesNoQuestion
              question="2. Gün içerisinde iştahsızlık yaşadınız mı?"
              value={hasFatigue}
              onChange={setHasFatigue}
            />
          </View>
        );
      case 5:
        return (
          <View style={styles.card}>
            <YesNoQuestion
              question="6. Günün herhangi bir zamanında alışılmışın dışında bir durum hissettiniz mi?"
              value={unusualFeeling}
              onChange={setUnusualFeeling}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Günlüğüm" showBack />
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((step + 1) / totalSteps) * 100}%` }]} />
      </View>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]}>
        {renderStep()}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>{step < totalSteps - 1 ? 'SONRAKİ SORU' : 'TAMAMLA'}</Text>
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
  questionBlock: { gap: 16 },
  question: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: Colors.text, lineHeight: 22 },
  radioRow: { flexDirection: 'row', gap: 24 },
  radioBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioBtnActive: {},
  radioCircle: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: Colors.border,
  },
  radioCircleActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  radioLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: Colors.textSecondary },
  radioLabelActive: { color: Colors.primary },
  sliderBlock: { gap: 12 },
  sliderLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: Colors.text, lineHeight: 20 },
  slider: { width: '100%' },
  sliderValue: {
    fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: Colors.primary, textAlign: 'center',
  },
  subQuestion: { backgroundColor: Colors.inputBg, borderRadius: 10, padding: 12 },
  subLabel: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: Colors.textSecondary },
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
    shadowColor: Colors.success, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  successTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: Colors.text },
  successText: { fontFamily: 'Nunito_400Regular', fontSize: 15, color: Colors.textSecondary },
  doneBtn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingHorizontal: 40, paddingVertical: 14,
  },
  doneBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: '#fff' },
});
