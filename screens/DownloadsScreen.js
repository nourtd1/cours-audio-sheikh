import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Alert, AccessibilityInfo, TouchableOpacity, Dimensions, Share } from 'react-native';
import { List, Button, Text, ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import i18n from '../utils/i18n';
import { LanguageContext } from '../App';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp, ZoomIn, BounceIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DOWNLOADED_AUDIOS_KEY = 'DOWNLOADED_AUDIOS';
const LOCAL_BOOK_PATH = FileSystem.documentDirectory + 'bookData.json';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PARTICLE_COUNT = 18;

function GoldParticles() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const left = Math.random() * (SCREEN_WIDTH - 40) + 10;
        const top = Math.random() * 220 + 10;
        const size = Math.random() * 10 + 6;
        const opacity = Math.random() * 0.5 + 0.3;
        return (
          <Animated.View
            key={i}
            entering={FadeIn.duration(1200 + i * 30)}
            style={{
              position: 'absolute',
              left,
              top,
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: '#FFD700',
              opacity,
              shadowColor: '#FFD700',
              shadowOpacity: 0.18,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 1 },
              elevation: 2,
            }}
          />
        );
      })}
    </View>
  );
}

const DownloadsScreen = () => {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [bookSaved, setBookSaved] = useState(false);
  const navigation = useNavigation();
  const { locale } = useContext(LanguageContext);

  // Charger les audios téléchargés
  const loadAudios = async () => {
    const data = await AsyncStorage.getItem(DOWNLOADED_AUDIOS_KEY);
    setAudios(data ? JSON.parse(data) : []);
  };

  // Vérifier si le livre est sauvegardé localement
  const checkBook = async () => {
    const info = await FileSystem.getInfoAsync(LOCAL_BOOK_PATH);
    setBookSaved(info.exists);
  };

  useEffect(() => {
    loadAudios();
    checkBook();
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: i18n.t('downloads.title') });
  }, [locale, navigation]);

  const handleRead = (audio) => {
    navigation.navigate('Audio', { course: audio });
    AccessibilityInfo.announceForAccessibility(i18n.t('open_audio') || 'Lecture audio');
  };

  const handleRemove = async (audio) => {
    setRemovingId(audio.id);
    setLoading(true);
    try {
      await FileSystem.deleteAsync(audio.fileUri, { idempotent: true });
      const data = await AsyncStorage.getItem(DOWNLOADED_AUDIOS_KEY);
      let arr = data ? JSON.parse(data) : [];
      arr = arr.filter((a) => a.id !== audio.id);
      await AsyncStorage.setItem(DOWNLOADED_AUDIOS_KEY, JSON.stringify(arr));
      setAudios(arr);
      AccessibilityInfo.announceForAccessibility(i18n.t('deleted') || 'Supprimé');
    } catch (e) {
      Alert.alert('Erreur', i18n.t('delete_error') || 'Erreur lors de la suppression');
    } finally {
      setRemovingId(null);
      setLoading(false);
    }
  };

  const handleSaveBook = async () => {
    setLoading(true);
    try {
      const asset = await FileSystem.readAsStringAsync(FileSystem.bundleDirectory + 'assets/bookData.json');
      await FileSystem.writeAsStringAsync(LOCAL_BOOK_PATH, asset);
      setBookSaved(true);
      AccessibilityInfo.announceForAccessibility(i18n.t('book_saved') || 'Livre sauvegardé pour lecture offline');
    } catch (e) {
      Alert.alert('Erreur', i18n.t('save_error') || 'Erreur lors de la sauvegarde du livre');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBook = async () => {
    setLoading(true);
    try {
      await FileSystem.deleteAsync(LOCAL_BOOK_PATH, { idempotent: true });
      setBookSaved(false);
      AccessibilityInfo.announceForAccessibility(i18n.t('book_deleted') || 'Livre supprimé du stockage local');
    } catch (e) {
      Alert.alert('Erreur', i18n.t('delete_error') || 'Erreur lors de la suppression du livre');
    } finally {
      setLoading(false);
    }
  };

  const shareAudio = async (audio) => {
    try {
      await Share.share({
        message: `${audio.titre}\n${audio.fileUri}`
      });
    } catch (e) {
      Alert.alert('Erreur', 'Erreur lors du partage');
    }
  };

  return (
    <LinearGradient colors={["#e0eafc", "#cfdef3", "#f8fafc"]} start={{x:0.2,y:0}} end={{x:1,y:1}} style={{flex:1}}>
      <GoldParticles />
    <View style={styles.container}>
        <Text style={styles.header}>التنزيلات</Text>
        <View style={styles.separator} />
        <Animated.View entering={FadeIn.duration(600)} style={styles.bookCard}>
          <LinearGradient colors={["#fffbe6", "#fff"]} style={styles.bookCardInner}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="book-open-page-variant" size={32} color="#bfa100" style={{ marginRight: 12 }} />
              <Text style={styles.bookTitle}>{i18n.t('pdf.title') || 'Livre'}</Text>
              {bookSaved && (
                <LinearGradient colors={["#FFD700", "#FFF8DC"]} style={styles.badgeGradient}>
                  <Text style={styles.badgeText}>✔</Text>
                </LinearGradient>
              )}
            </View>
            <Text style={styles.bookStatus}>{bookSaved ? (i18n.t('book_saved') || 'Livre disponible hors-ligne') : (i18n.t('book_not_saved') || 'Livre non sauvegardé')}</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.bookBtn, bookSaved ? styles.bookBtnOutlined : styles.bookBtnContained]}
            onPress={bookSaved ? handleRemoveBook : handleSaveBook}
                activeOpacity={0.85}
          >
                <MaterialCommunityIcons name={bookSaved ? 'delete' : 'download'} size={20} color={bookSaved ? '#bfa100' : '#fff'} style={{ marginRight: 6 }} />
                <Text style={[styles.bookBtnText, bookSaved && { color: '#bfa100' }]}>
            {bookSaved ? (i18n.t('delete_book') || 'Supprimer du stockage local') : (i18n.t('save_book') || 'Sauvegarder pour lecture offline')}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
        <Text style={styles.subHeader}>{i18n.t('downloaded_audios') || 'Audios téléchargés'}</Text>
        {audios.length === 0 ? (
          <Text style={styles.noResult}>{i18n.t('no_downloads') || 'Aucun audio téléchargé'}</Text>
        ) : (
          audios.map((audio, idx) => (
            <Animated.View entering={SlideInUp.duration(600 + idx*40)} style={styles.audioCard} key={audio.id}>
              <LinearGradient colors={["#fffbe6", "#fff"]} style={styles.audioCardInner}>
                <View style={styles.audioRow}>
                  <LinearGradient colors={["#fffbe6", "#fff"]} style={styles.iconCircle}>
                    <MaterialCommunityIcons name="music" size={28} color="#a11d2a" style={styles.musicIcon} />
                    <View style={styles.musicLight} />
                  </LinearGradient>
                  <View style={styles.audioContent}>
                    <Text style={styles.audioTitle}>{audio.titre}</Text>
                    <Text style={styles.audioDesc}>{`${audio.categorie} • ${audio.theme} • ${audio.date}`}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.audioBtn}
                    onPress={() => handleRead(audio)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="play-circle" size={32} color="#1976d2" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.audioBtn}
                    onPress={() => handleRemove(audio)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="delete" size={28} color="#a11d2a" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.audioBtn}
                    onPress={() => shareAudio(audio)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="share-variant" size={26} color="#bfa100" />
                  </TouchableOpacity>
                  <View style={styles.badgeWrapper}>
                    <LinearGradient colors={["#FFD700", "#FFF8DC"]} style={styles.badgeGradient}>
                      <Animated.Text entering={BounceIn.duration(700)} style={styles.badgeText}>{idx + 1}</Animated.Text>
                    </LinearGradient>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          ))
        )}
        {audios.length > 0 && (
          <Animated.View entering={BounceIn.duration(900)} style={styles.quoteWrapper}>
            <Text style={styles.quoteText}>
              <Text style={styles.quoteMark}>“</Text>
              <Text style={styles.quoteHighlight}>كل درس تحتفظ به هنا هو زادك للعلم</Text>
              <Text style={styles.quoteMark}>”</Text>
            </Text>
          </Animated.View>
        )}
        {loading && <ProgressBar indeterminate color="#bfa100" style={{ marginTop: 16, borderRadius: 8, height: 8 }} accessibilityLabel="Opération en cours" />}
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: 'transparent',
  },
  header: {
    fontSize: 30,
    fontFamily: 'Amiri',
    color: '#1976d2',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  separator: {
    width: 70,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFD700',
    marginVertical: 10,
    alignSelf: 'center',
    opacity: 0.8,
  },
  bookCard: {
    marginBottom: 18,
    borderRadius: 22,
    shadowColor: '#FFD700',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    overflow: 'hidden',
  },
  bookCardInner: {
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 20,
    fontFamily: 'Amiri',
    color: '#bfa100',
    fontWeight: 'bold',
  },
  bookStatus: {
    fontSize: 15,
    color: '#1976d2',
    marginTop: 6,
    fontFamily: 'Amiri',
    textAlign: 'center',
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 4,
    elevation: 2,
  },
  bookBtnContained: {
    backgroundColor: '#1976d2',
  },
  bookBtnOutlined: {
    backgroundColor: '#fffbe6',
    borderWidth: 1.5,
    borderColor: '#bfa100',
  },
  bookBtnText: {
    color: '#fff',
    fontFamily: 'Amiri',
    fontSize: 15,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
    fontFamily: 'Amiri',
    textAlign: 'center',
  },
  noResult: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontFamily: 'Amiri',
  },
  audioCard: {
    marginBottom: 16,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    overflow: 'hidden',
  },
  audioCardInner: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'transparent',
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginLeft: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  musicIcon: {
    zIndex: 2,
  },
  musicLight: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,215,0,0.13)',
    zIndex: 1,
  },
  audioContent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Amiri',
    marginBottom: 2,
  },
  audioDesc: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Amiri',
    marginBottom: 2,
  },
  audioBtn: {
    marginLeft: 6,
    marginRight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0eafc',
    borderRadius: 14,
    padding: 6,
    elevation: 2,
  },
  badgeWrapper: {
    marginLeft: 10,
    marginRight: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 2,
    borderColor: '#bfa100',
  },
  badgeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Amiri',
    zIndex: 2,
    textShadowColor: '#bfa100',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  quoteWrapper: {
    marginTop: 18,
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#FFD700',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quoteText: {
    fontFamily: 'Amiri',
    fontSize: 18,
    color: '#1976d2',
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  quoteMark: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 2,
  },
  quoteHighlight: {
    backgroundColor: '#fffbe6',
    borderRadius: 8,
    paddingHorizontal: 6,
    color: '#bfa100',
    fontWeight: 'bold',
    fontSize: 19,
  },
});

export default DownloadsScreen; 