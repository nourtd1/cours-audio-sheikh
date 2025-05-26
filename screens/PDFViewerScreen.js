// screens/PDFViewerScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import i18n from '../utils/i18n';

const PDFViewerScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text accessibilityRole="header" style={{ fontSize: 24 }}>{i18n.t('pdf.title')}</Text>
  </View>
);

export default PDFViewerScreen; 