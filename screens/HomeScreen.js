import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import i18n from '../utils/i18n';

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text accessibilityRole="header" style={{ fontSize: 24 }}>{i18n.t('home')}</Text>
      <Button
        mode="contained"
        style={{ marginTop: 24 }}
        onPress={() => navigation.navigate('Courses')}
        accessibilityLabel="Voir la liste des cours audio"
      >
        {i18n.t('courses')}
      </Button>
    </View>
  );
};

export default HomeScreen; 