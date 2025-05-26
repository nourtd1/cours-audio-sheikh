// screens/CourseListScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, StyleSheet, I18nManager, Alert, AccessibilityInfo, Text } from 'react-native';
import CourseItem from '../components/CourseItem';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import i18n from '../utils/i18n';
import Animated, { FadeIn } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar, Button } from 'react-native-paper';
import { LanguageContext } from '../App';
import * as Notifications from 'expo-notifications';

const FAVORITES_KEY = 'COURSE_FAVORITES';
const DOWNLOADED_AUDIOS_KEY = 'DOWNLOADED_AUDIOS';
const PAGE_SIZE = 2;

const mockCourses = [
  {
    id: '1',
    titre: 'Tafsir Sourate Al-Fatiha',
    categorie: 'Tafsir',
    theme: 'Introduction',
    date: '2023-04-01',
    urlAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    titre: 'Fiqh de la Prière',
    categorie: 'Fiqh',
    theme: 'Prière',
    date: '2023-05-10',
    urlAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    titre: 'Sira du Prophète',
    categorie: 'Sira',
    theme: 'Biographie',
    date: '2023-06-15',
    urlAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: '4',
    titre: 'Tafsir Sourate Al-Baqara',
    categorie: 'Tafsir',
    theme: 'Début',
    date: '2023-07-01',
    urlAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
];

const CourseListScreen = () => {
  const [courses] = useState(mockCourses);
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFav, setShowOnlyFav] = useState(false);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [downloadProgress, setDownloadProgress] = useState({});
  const navigation = useNavigation();
  const { locale } = useContext(LanguageContext);

  // Charger les favoris
  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY).then(data => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  // Sauvegarder les favoris
  useEffect(() => {
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    navigation.setOptions({ title: i18n.t('courses.title') });
  }, [locale, navigation]);

  const handlePlay = (course) => {
    navigation.navigate('Audio', { course });
  };

  const handleDownload = async (course) => {
    try {
      const fileUri = FileSystem.documentDirectory + `${course.titre}.mp3`;
      setDownloadProgress((prev) => ({ ...prev, [course.id]: 0 }));
      const downloadResumable = FileSystem.createDownloadResumable(
        course.urlAudio,
        fileUri,
        {},
        (progress) => {
          const percent = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
          setDownloadProgress((prev) => ({ ...prev, [course.id]: percent }));
        }
      );
      await downloadResumable.downloadAsync();
      setDownloadProgress((prev) => ({ ...prev, [course.id]: 1 }));
      // Stocker les métadonnées
      const meta = {
        id: course.id,
        titre: course.titre,
        categorie: course.categorie,
        theme: course.theme,
        date: course.date,
        fileUri,
        downloadedAt: new Date().toISOString(),
      };
      const existing = await AsyncStorage.getItem(DOWNLOADED_AUDIOS_KEY);
      let arr = existing ? JSON.parse(existing) : [];
      arr = arr.filter((c) => c.id !== course.id); // éviter doublons
      arr.push(meta);
      await AsyncStorage.setItem(DOWNLOADED_AUDIOS_KEY, JSON.stringify(arr));
      setSnackbar({ visible: true, message: `${course.titre} ${i18n.t('courses.download_success') || 'téléchargé !'}` });
      AccessibilityInfo.announceForAccessibility(`${course.titre} ${i18n.t('courses.download_success') || 'téléchargé !'}`);
      // Notification locale automatique
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Téléchargement terminé',
          body: `${course.titre} est maintenant disponible hors-ligne.`,
        },
        trigger: null,
      });
    } catch (error) {
      setSnackbar({ visible: true, message: i18n.t('courses.download_error') || 'Erreur de téléchargement.' });
      AccessibilityInfo.announceForAccessibility(i18n.t('courses.download_error') || 'Erreur de téléchargement.');
    } finally {
      setDownloadProgress((prev) => ({ ...prev, [course.id]: undefined }));
    }
  };

  const handleToggleFavorite = (course) => {
    setFavorites((prev) =>
      prev.includes(course.id)
        ? prev.filter((id) => id !== course.id)
        : [...prev, course.id]
    );
    setSnackbar({
      visible: true,
      message: favorites.includes(course.id)
        ? i18n.t('courses.removed_from_favorites') || 'Retiré des favoris'
        : i18n.t('courses.added_to_favorites') || 'Ajouté aux favoris',
    });
  };

  // Pagination et filtrage favoris
  const filteredCourses = showOnlyFav
    ? courses.filter((c) => favorites.includes(c.id))
    : courses;
  const paginatedCourses = filteredCourses.slice(0, page * PAGE_SIZE);
  const canLoadMore = paginatedCourses.length < filteredCourses.length;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Button
          mode={showOnlyFav ? 'contained' : 'outlined'}
          icon={showOnlyFav ? 'star' : 'star-outline'}
          onPress={() => setShowOnlyFav((v) => !v)}
          accessibilityLabel={showOnlyFav ? 'Voir tous les cours' : 'Voir seulement les favoris'}
          style={styles.favFilterBtn}
        >
          {showOnlyFav ? i18n.t('courses.list') || 'Tous' : i18n.t('favorites') || 'Favoris'}
        </Button>
      </View>
      <Animated.View entering={FadeIn.duration(600)} style={{ flex: 1 }}>
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <CourseItem
              title={item.titre}
              number={index + 1}
              isFavorite={favorites.includes(item.id)}
              onFavoritePress={() => handleToggleFavorite(item)}
              onPress={() => handlePlay(item)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </Animated.View>
      <View style={styles.adBanner}>
        <View style={styles.adBannerInner}>
          <View style={{ flex: 1 }} />
          <View>
            <View style={styles.adBadge}><Text style={styles.adBadgeText}>Ad</Text></View>
          </View>
        </View>
        <Text style={styles.adText}>مساحة الوحدة الإعلانية المحجوزة</Text>
      </View>
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={2000}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6', padding: 12 },
  topRow: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 16,
    marginBottom: 4,
  },
  favFilterBtn: {
    borderRadius: 20,
  },
  adBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    height: 48,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 12,
  },
  adBannerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 24,
    paddingHorizontal: 8,
  },
  adBadge: {
    backgroundColor: '#ffd600',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  adBadgeText: { color: '#333', fontWeight: 'bold', fontSize: 12 },
  adText: { color: '#aaa', textAlign: 'center', fontSize: 13, marginTop: 18 },
});

export default CourseListScreen; 