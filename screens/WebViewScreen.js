import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://www.wikipedia.org' }}
        style={{ flex: 1 }}
        startInLoadingState
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 24, fontFamily: 'Amiri', color: '#1976d2' },
}); 