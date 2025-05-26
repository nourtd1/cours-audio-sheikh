import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Alert, AccessibilityInfo } from 'react-native';
import { List, Button, Text, ProgressBar, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import i18n from '../utils/i18n';
import { LanguageContext } from '../App';

const DOWNLOADED_AUDIOS_KEY = 'DOWNLOADED_AUDIOS';
const LOCAL_BOOK_PATH = FileSystem.documentDirectory + 'bookData.json';

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t('downloads.title') || 'Téléchargements'}</Text>
      <Card style={styles.bookCard}>
        <Card.Title title={i18n.t('pdf.title') || 'Livre'} />
        <Card.Content>
          <Text>{bookSaved ? (i18n.t('book_saved') || 'Livre disponible hors-ligne') : (i18n.t('book_not_saved') || 'Livre non sauvegardé')}</Text>
          <Button
            mode={bookSaved ? 'outlined' : 'contained'}
            onPress={bookSaved ? handleRemoveBook : handleSaveBook}
            loading={loading}
            accessibilityLabel={bookSaved ? 'Supprimer le livre local' : 'Sauvegarder le livre pour lecture offline'}
            style={{ marginTop: 8 }}
          >
            {bookSaved ? (i18n.t('delete_book') || 'Supprimer du stockage local') : (i18n.t('save_book') || 'Sauvegarder pour lecture offline')}
          </Button>
        </Card.Content>
      </Card>
      <List.Section>
        <Text style={styles.subHeader}>{i18n.t('downloaded_audios') || 'Audios téléchargés'}</Text>
        {audios.length === 0 ? (
          <Text style={styles.noResult}>{i18n.t('no_downloads') || 'Aucun audio téléchargé'}</Text>
        ) : (
          audios.map(audio => (
            <List.Item
              key={audio.id}
              title={audio.titre}
              description={`${audio.categorie} • ${audio.theme} • ${audio.date}`}
              right={props => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    mode="contained"
                    onPress={() => handleRead(audio)}
                    accessibilityLabel="Lire l'audio"
                    icon="play"
                    style={{ marginRight: 8 }}
                  >
                    {i18n.t('read') || 'Lire'}
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleRemove(audio)}
                    loading={removingId === audio.id && loading}
                    accessibilityLabel="Supprimer l'audio"
                    icon="delete"
                  >
                    {i18n.t('delete') || 'Supprimer'}
                  </Button>
                </View>
              )}
              accessibilityLabel={`${audio.titre}, ${audio.categorie}, ${audio.theme}, ${audio.date}`}
              style={styles.resultItem}
            />
          ))
        )}
      </List.Section>
      {loading && <ProgressBar indeterminate color="#1976d2" style={{ marginTop: 16 }} accessibilityLabel="Opération en cours" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1976d2',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  noResult: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
  },
  resultItem: {
    backgroundColor: '#f5f5f5',
    marginBottom: 4,
    borderRadius: 8,
  },
  bookCard: {
    marginBottom: 24,
  },
});

export default DownloadsScreen; 