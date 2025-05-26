// screens/SearchScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, I18nManager, FlatList } from 'react-native';
import { Text, Searchbar, Button, Menu, Divider, List } from 'react-native-paper';
import i18n from '../utils/i18n';
import bookData from '../assets/bookData.json';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { LanguageContext } from '../App';

const mockCourses = [
  {
    id: '1',
    title: 'Introduction au Tafsir',
    category: 'Tafsir',
    theme: 'Coran',
    date: '2024-06-01',
  },
  {
    id: '2',
    title: 'Les bases du Fiqh',
    category: 'Fiqh',
    theme: 'Jurisprudence',
    date: '2024-05-20',
  },
  {
    id: '3',
    title: 'La Sira du Prophète',
    category: 'Sira',
    theme: 'Biographie',
    date: '2024-04-15',
  },
];

const categories = ['Tafsir', 'Fiqh', 'Sira'];

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();
  const { locale } = useContext(LanguageContext);

  useEffect(() => {
    navigation.setOptions({ title: i18n.t('search.title') });
  }, [locale, navigation]);

  useEffect(() => {
    // Recherche dans les cours
    let courseResults = mockCourses.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase()) &&
      (category ? course.category === category : true) &&
      (date ? course.date === date : true)
    ).map(item => ({ ...item, type: 'course' }));

    // Recherche dans le livre (titre ou contenu)
    let bookResults = bookData.filter(chap =>
      chap.title.toLowerCase().includes(query.toLowerCase()) ||
      chap.content.toLowerCase().includes(query.toLowerCase())
    ).map(item => ({ ...item, type: 'book' }));

    setFiltered([...courseResults, ...bookResults]);
  }, [query, category, date]);

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
      <View style={styles.filtersRow}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              accessibilityLabel={i18n.t('courses.category') || 'Catégorie'}
            >
              {category || i18n.t('courses.category') || 'Catégorie'}
            </Button>
          }
        >
          {categories.map(cat => (
            <Menu.Item key={cat} onPress={() => { setCategory(cat); setMenuVisible(false); }} title={cat} />
          ))}
          <Divider />
          <Menu.Item onPress={() => { setCategory(''); setMenuVisible(false); }} title={i18n.t('courses.all') || 'Toutes'} />
        </Menu>
        <Button
          mode="outlined"
          onPress={() => setDate('2024-06-01')}
          accessibilityLabel={i18n.t('courses.date') || 'Date'}
        >
          {date || i18n.t('courses.date') || 'Date'}
        </Button>
        <Button mode="text" onPress={() => { setCategory(''); setDate(''); }} accessibilityLabel={i18n.t('courses.reset_filters') || 'Réinitialiser'}>
          {i18n.t('courses.reset_filters') || 'Réinitialiser'}
        </Button>
      </View>
      <List.Section>
        {filtered.length === 0 ? (
          <Text style={styles.noResult}>{i18n.t('search.no_results') || 'Aucun résultat'}</Text>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.type + '-' + item.id}
            renderItem={({ item }) => (
              <List.Item
                title={item.title}
                description={item.type === 'course' ? `${item.category} • ${item.theme} • ${item.date}` : item.content}
                accessibilityLabel={item.type === 'course' ? `${item.title}, ${item.category}, ${item.theme}, ${item.date}` : `${item.title}, ${item.content}`}
                style={styles.resultItem}
                right={props => <List.Icon {...props} icon={item.type === 'course' ? 'book' : 'book-open-variant'} />}
                onPress={() => {
                  if (item.type === 'course') {
                    navigation.navigate('Audio', { course: item });
                  } else {
                    navigation.navigate('Book', { chapter: item });
                  }
                }}
                accessible
                accessibilityRole="button"
              />
            )}
            ListEmptyComponent={<Text style={styles.noResult}>{i18n.t('search.no_results') || 'Aucun résultat'}</Text>}
            accessibilityLabel="Liste des résultats de recherche"
          />
        )}
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchbar: {
    marginBottom: 12,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  filtersRow: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  resultItem: {
    backgroundColor: '#f5f5f5',
    marginBottom: 4,
    borderRadius: 8,
  },
  noResult: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
  },
});

export default SearchScreen; 