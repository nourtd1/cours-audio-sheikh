import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const dhikrs = ['سبحان الله', 'الحمد لله', 'الله أكبر'];
const { width } = Dimensions.get('window');

export default function TasbihScreen() {
  const [count, setCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState(0);
  const scale = useState(new Animated.Value(1))[0];

  const handleIncrement = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.15, duration: 120, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true, easing: Easing.in(Easing.ease) })
    ]).start();
    setCount(count + 1);
  };

  return (
    <LinearGradient colors={["#e0eafc", "#cfdef3"]} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>عدد التسبيحات</Text>
        <Animated.View style={[styles.circle, { transform: [{ scale }] }]}> 
          <Text style={styles.counter}>{count}</Text>
        </Animated.View>
        <View style={styles.dhikrRow}>
          {dhikrs.map((d, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.dhikrBtn, selectedDhikr === i && styles.dhikrBtnActive]}
              onPress={() => setSelectedDhikr(i)}
            >
              <Text style={[styles.dhikrText, selectedDhikr === i && styles.dhikrTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleIncrement}>
          <Text style={styles.btnText}>{dhikrs[selectedDhikr]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={() => setCount(0)}>
          <Text style={styles.resetText}>إعادة التصفير</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const CIRCLE_SIZE = width * 0.45;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontFamily: 'Amiri', color: '#1976d2', marginBottom: 24 },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 8,
    shadowColor: '#1976d2',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  counter: { fontSize: 64, color: '#388e3c', fontFamily: 'Amiri' },
  dhikrRow: { flexDirection: 'row', marginBottom: 24, gap: 8 },
  dhikrBtn: {
    backgroundColor: '#e3e3e3',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 4,
  },
  dhikrBtnActive: {
    backgroundColor: '#1976d2',
  },
  dhikrText: {
    color: '#1976d2',
    fontSize: 20,
    fontFamily: 'Amiri',
  },
  dhikrTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  btn: { backgroundColor: '#388e3c', paddingVertical: 18, paddingHorizontal: 48, borderRadius: 32, marginBottom: 16, elevation: 2 },
  btnText: { color: '#fff', fontSize: 24, fontFamily: 'Amiri' },
  resetBtn: { marginTop: 8 },
  resetText: { color: '#1976d2', fontSize: 18, fontFamily: 'Amiri' },
}); 