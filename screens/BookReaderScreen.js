import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, I18nManager, AccessibilityInfo, findNodeHandle } from 'react-native';
import { Searchbar, Button, Card } from 'react-native-paper';
import i18n from '../utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import bookData from '../assets/data/book.json';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LanguageContext } from '../App';

const STORAGE_KEY = 'BOOK_READER_POSITION';

const BookReaderScreen = () => {
  const route = useRoute();
  const chapterFromParams = route.params?.chapter;
  const chapterId = route.params?.chapterId;
  const highlight = route.params?.highlight;
  const [query, setQuery] = useState('');
  const [chapters, setChapters] = useState(bookData);
  const [current, setCurrent] = useState(0);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showFullBook, setShowFullBook] = useState(false);
  const navigation = useNavigation();
  const { locale } = useContext(LanguageContext);

  // Charger la police Amiri si arabe
  useEffect(() => {
    if (I18nManager.isRTL) {
      Font.loadAsync({ Amiri: require('../assets/fonts/Amiri-Regular.ttf') }).then(() => setFontLoaded(true));
    } else {
      setFontLoaded(true);
    }
  }, []);

  // Recherche
  useEffect(() => {
    if (!query) {
      setChapters(bookData);
    } else {
      setChapters(
        bookData.filter(chap =>
          chap.title.toLowerCase().includes(query.toLowerCase()) ||
          chap.content.toLowerCase().includes(query.toLowerCase())
        )
      );
      setCurrent(0);
    }
  }, [query]);

  // Sauvegarde/chargement de la position
  useEffect(() => {
    const loadPos = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setCurrent(Number(saved));
    };
    loadPos();
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, String(current));
  }, [current]);

  // Scroll et highlight si chapterId présent
  useEffect(() => {
    if (chapterId) {
      const idx = bookData.findIndex(chap => chap.id === chapterId);
      if (idx !== -1) setCurrent(idx);
    }
  }, [chapterId]);

  useEffect(() => {
    navigation.setOptions({ title: i18n.t('pdf.title') });
  }, [locale, navigation]);

  if (chapterFromParams && !showFullBook) {
    // Affichage direct du chapitre passé en paramètre
    const titleRef = useRef(null);
    const highlightRef = useRef(null);
    const backBtnRef = useRef(null);
    useEffect(() => {
      if (titleRef.current) {
        titleRef.current.focus && titleRef.current.focus();
      }
      // Focus sur le bouton retour si présent
      if (route.params?.fromSearch && backBtnRef.current) {
        backBtnRef.current.focus && backBtnRef.current.focus();
      }
      // Focus et annonce accessibilité sur le texte surligné
      if (highlight && highlightRef.current) {
        const node = findNodeHandle(highlightRef.current);
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
        // Annonce du nombre d'occurrences
        const count = (chapterFromParams.content.match(new RegExp(highlight.split(' ').join('|'), 'gi')) || []).length;
        if (count > 0) {
          AccessibilityInfo.announceForAccessibility(`${count} occurrence${count > 1 ? 's' : ''} trouvée${count > 1 ? 's' : ''} pour ${highlight}`);
        }
      }
    }, [highlight]);
    // Scroll automatique vers la première occurrence
    const scrollViewRef = useRef(null);
    useEffect(() => {
      if (highlight && scrollViewRef.current) {
        const idx = chapterFromParams.content.toLowerCase().indexOf(highlight.toLowerCase());
        if (idx !== -1) {
          setTimeout(() => {
            scrollViewRef.current.scrollTo({ y: Math.max(0, idx * 0.6), animated: true });
          }, 300);
        }
      }
    }, [highlight]);
    if (!fontLoaded) return null;
    return (
      <View style={styles.container}>
        <Button
          mode="outlined"
          onPress={() => setShowFullBook(true)}
          accessibilityLabel="Voir tout le livre"
          style={{ marginBottom: 12 }}
        >
          {i18n.t('see_full_book') || 'Voir tout le livre'}
        </Button>
        <Button
          mode="text"
          onPress={() => {
            if (route.params?.fromSearch) route.params.fromSearch();
          }}
          accessibilityLabel="Retour à la recherche"
          style={{ marginBottom: 8 }}
          ref={backBtnRef}
        >
          Retour à la recherche
        </Button>
        <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
          <Card style={styles.card} accessible accessibilityLabel={chapterFromParams.title}>
            <Card.Title
              title={chapterFromParams.title}
              titleStyle={styles.title}
              ref={titleRef}
              accessibilityRole="header"
            />
            <Card.Content>
              <HighlightableText text={chapterFromParams.content} highlight={highlight} highlightRef={highlightRef} />
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
    );
  }

  if (!fontLoaded) return null;

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={i18n.t('search.title')}
        value={query}
        onChangeText={setQuery}
        style={styles.searchbar}
        accessibilityLabel={i18n.t('search.title')}
        textAlign={I18nManager.isRTL ? 'right' : 'left'}
      />
      <ScrollView horizontal style={styles.chaptersRow} contentContainerStyle={styles.chaptersContent}>
        {chapters.map((chap, idx) => (
          <Button
            key={chap.id}
            mode={idx === current ? 'contained' : 'outlined'}
            onPress={() => setCurrent(idx)}
            style={styles.chapterBtn}
            accessibilityLabel={chap.title}
          >
            {chap.title}
          </Button>
        ))}
      </ScrollView>
      <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.card} accessible accessibilityLabel={chapters[current]?.title}>
          <Card.Title title={chapters[current]?.title} titleStyle={styles.title} />
          <Card.Content>
            <HighlightableText text={chapters[current]?.content} highlight={highlight} />
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
  },
  searchbar: {
    marginBottom: 12,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  chaptersRow: {
    marginBottom: 8,
    maxHeight: 48,
  },
  chaptersContent: {
    alignItems: 'center',
    gap: 8,
    paddingRight: 8,
  },
  chapterBtn: {
    marginRight: 8,
    borderRadius: 16,
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  content: {
    fontSize: 18,
    marginTop: 8,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    lineHeight: 32,
    color: '#222',
  },
});

function HighlightableText({ text, highlight, highlightRef }) {
  if (!highlight || !highlight.trim()) {
    return <Text style={[styles.content, I18nManager.isRTL && { fontFamily: 'Amiri' }]}>{text}</Text>;
  }
  // Gestion multi-mots
  const words = highlight.trim().split(/\s+/).filter(Boolean);
  const regex = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);
  let first = true;
  return (
    <Text style={[styles.content, I18nManager.isRTL && { fontFamily: 'Amiri' }]}> 
      {parts.map((part, i) =>
        words.some(w => part.toLowerCase() === w.toLowerCase()) ? (
          <Animated.Text
            key={i}
            ref={first ? highlightRef : undefined}
            entering={FadeIn.duration(600)}
            style={{ backgroundColor: 'yellow', color: '#222' }}
          >
            {first ? (first = false, part) : part}
          </Animated.Text>
        ) : (
          <Text key={i}>{part}</Text>
        )
      )}
    </Text>
  );
}

export default BookReaderScreen; 