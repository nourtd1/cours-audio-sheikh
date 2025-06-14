import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

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

export default function TasbihSelectScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedDhikr = route.params?.selectedDhikr ?? 0;

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>تغيير الذكر</Text>
        {dhikrs.map((d, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.dhikrListItem, selectedDhikr === i && styles.dhikrListItemActive]}
            onPress={() => {
              navigation.navigate('Tasbih', { selectedDhikr: i });
            }}
            activeOpacity={0.85}
          >
            <View style={[styles.radio, selectedDhikr === i && styles.radioActive]}>
              {selectedDhikr === i && <MaterialCommunityIcons name="check" size={18} color="#fff" />}
            </View>
            <Text style={styles.dhikrListText}>{d}</Text>
            {selectedDhikr === i && <Text style={styles.selectedLabel}>Selected</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#f6f6f7' },
  container: { flexGrow: 1, alignItems: 'center', padding: 18, paddingBottom: 32 },
  title: { fontSize: 22, color: '#1976d2', fontFamily: 'Amiri', fontWeight: 'bold', marginBottom: 18, textAlign: 'center' },
  dhikrListItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 10, elevation: 1, width: '100%' },
  dhikrListItemActive: { borderWidth: 2, borderColor: '#1976d2', backgroundColor: '#e0eafc' },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#bbb', alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: '#fff' },
  radioActive: { backgroundColor: '#1976d2', borderColor: '#1976d2' },
  dhikrListText: { flex: 1, fontSize: 20, color: '#222', fontFamily: 'Amiri', textAlign: 'right' },
  selectedLabel: { backgroundColor: '#1976d2', color: '#fff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2, fontSize: 14, marginLeft: 8, fontFamily: 'Amiri' },
}); 