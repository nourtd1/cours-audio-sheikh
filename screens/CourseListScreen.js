// screens/CourseListScreen.js
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Alert, I18nManager } from 'react-native';
import CourseItem from '../components/CourseItem';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import i18n from '../utils/i18n';

const mockCourses = [
  {
    id: '1',
    title: 'Introduction au Tafsir',
    category: 'Tafsir',
    theme: 'Coran',
    date: '2024-06-01',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Les bases du Fiqh',
    category: 'Fiqh',
    theme: 'Jurisprudence',
    date: '2024-05-20',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'La Sira du Prophète',
    category: 'Sira',
    theme: 'Biographie',
    date: '2024-04-15',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

const CourseListScreen = () => {
  const [courses] = useState(mockCourses);
  const navigation = useNavigation();

  const handlePlay = (course) => {
    navigation.navigate('Audio', { course });
  };

  const handleDownload = async (course) => {
    try {
      const fileUri = FileSystem.documentDirectory + `${course.title}.mp3`;
      await FileSystem.downloadAsync(course.audioUrl, fileUri);
      Alert.alert(i18n.t('download_success') || 'Téléchargement réussi', `${course.title} a été téléchargé.`);
    } catch (error) {
      Alert.alert(i18n.t('download_error') || 'Erreur', 'Le téléchargement a échoué.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseItem
            title={item.title}
            category={item.category}
            theme={item.theme}
            date={item.date}
            onPlay={() => handlePlay(item)}
            onDownload={() => handleDownload(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        accessibilityLabel="Liste des cours audio"
        inverted={I18nManager.isRTL}
      />
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default CourseListScreen; 