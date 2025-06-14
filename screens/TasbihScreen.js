import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const dhikrs = [
  'سُبْحَانَ اللّٰه',
  'الْحَمْدُ لِلّٰه',
  'اللّٰهُ أَكْبَر',
  'أَسْتَغْفِرُ اللّٰه',
  'أَسْتَغْفِرُ اللّٰه رَبِّي وَأَتُوبُ إِلَيْهِ',
  'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيم',
  'لَا إِلٰهَ إِلَّا اللّٰه مُحَمَّدٌ رَسُولُ اللّٰه',
  'لَا إِلٰهَ إِلَّا اللّٰه',
];
const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.48;

export default function TasbihScreen() {
  const [count, setCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState(0);
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const idx = navigation.getState().routes.find(r => r.name === 'TasbihSelect');
      if (idx && navigation.getState().routes[idx.key]?.params?.selectedDhikr !== undefined) {
        setSelectedDhikr(navigation.getState().routes[idx.key].params.selectedDhikr);
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header reset */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.resetBtn} onPress={() => setCount(0)}>
            <MaterialCommunityIcons name="restore" size={22} color="#d32f2f" style={{ marginRight: 6 }} />
            <Text style={styles.resetText}>إعادة تعيين العدد</Text>
          </TouchableOpacity>
        </View>
        {/* Bloc dhikr sélectionné */}
        <View style={styles.card}>
          <Text style={styles.dhikrSelected}>{dhikrs[selectedDhikr]}</Text>
          <TouchableOpacity style={styles.changeDhikrBtn} onPress={() => navigation.navigate('TasbihSelect', { selectedDhikr })}>
            <Text style={styles.changeDhikrText}>تغيير الذكر</Text>
            <MaterialCommunityIcons name="chevron-left" size={22} color="#222" />
          </TouchableOpacity>
        </View>
        {/* Compteur */}
        <View style={styles.counterCard}>
          <View style={styles.circle}>
            <Text style={styles.counter}>{count}</Text>
            <Text style={styles.counterLabel}>حلقة</Text>
          </View>
          <TouchableOpacity style={styles.countBtn} onPress={() => setCount(count + 1)}>
            <Text style={styles.countBtnText}>انقر للعد +1</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#f6f6f7' },
  container: { flexGrow: 1, alignItems: 'center', padding: 18, paddingBottom: 32 },
  headerRow: { width: '100%', alignItems: 'flex-end', marginBottom: 18 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 18, elevation: 2 },
  resetText: { color: '#d32f2f', fontSize: 16, fontFamily: 'Amiri', fontWeight: 'bold' },
  card: { width: '100%', backgroundColor: '#eaeaea', borderRadius: 22, padding: 18, alignItems: 'center', marginBottom: 18 },
  dhikrSelected: { fontSize: 26, color: '#222', fontFamily: 'Amiri', marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
  changeDhikrBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 18, elevation: 1 },
  changeDhikrText: { color: '#222', fontSize: 16, fontFamily: 'Amiri', marginLeft: 6 },
  counterCard: { width: '100%', backgroundColor: '#eaeaea', borderRadius: 22, padding: 18, alignItems: 'center', marginBottom: 18 },
  circle: { width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE/2, backgroundColor: '#f6f6f7', alignItems: 'center', justifyContent: 'center', marginBottom: 18, borderWidth: 2, borderColor: '#d1d1d1' },
  counter: { fontSize: 54, color: '#222', fontFamily: 'Amiri', fontWeight: 'bold' },
  counterLabel: { fontSize: 18, color: '#888', fontFamily: 'Amiri', marginTop: 2 },
  countBtn: { backgroundColor: '#222', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 48, marginTop: 8, elevation: 2 },
  countBtnText: { color: '#fff', fontSize: 20, fontFamily: 'Amiri', fontWeight: 'bold' },
}); 