import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WebViewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>موقعنا (WebView)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 24, fontFamily: 'Amiri', color: '#1976d2' },
}); 