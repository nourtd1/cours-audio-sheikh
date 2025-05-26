import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PolicyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>سياسة التطبيق</Text>
      <Text style={styles.text}>
        هذا التطبيق يهدف إلى نشر العلم الشرعي بطريقة مبسطة. جميع الحقوق محفوظة. لا يتم جمع أي بيانات شخصية من المستخدمين. استخدامك للتطبيق يعني موافقتك على هذه السياسة.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 24, alignItems: 'center' },
  title: { fontSize: 28, fontFamily: 'Amiri', color: '#1976d2', marginBottom: 24, textAlign: 'center' },
  text: { fontSize: 20, fontFamily: 'Amiri', color: '#333', textAlign: 'center' },
}); 