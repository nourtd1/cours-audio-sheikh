// screens/SearchScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import { Text, Searchbar, Button, Menu, Divider, List } from 'react-native-paper';
import i18n from '../utils/i18n';

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
  const [filtered, setFiltered] = useState(mockCourses);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    let results = mockCourses.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase()) &&
      (category ? course.category === category : true) &&
      (date ? course.date === date : true)
    );
    setFiltered(results);
  }, [query, category, date]);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={i18n.t('search')}
        value={query}
        onChangeText={setQuery}
        style={styles.searchbar}
        accessibilityLabel={i18n.t('search')}
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
              accessibilityLabel={i18n.t('category') || 'Catégorie'}
            >
              {category || i18n.t('category') || 'Catégorie'}
            </Button>
          }
        >
          {categories.map(cat => (
            <Menu.Item key={cat} onPress={() => { setCategory(cat); setMenuVisible(false); }} title={cat} />
          ))}
          <Divider />
          <Menu.Item onPress={() => { setCategory(''); setMenuVisible(false); }} title={i18n.t('all') || 'Toutes'} />
        </Menu>
        <Button
          mode="outlined"
          onPress={() => setDate('2024-06-01')}
          accessibilityLabel={i18n.t('date') || 'Date'}
        >
          {date || i18n.t('date') || 'Date'}
        </Button>
        <Button mode="text" onPress={() => { setCategory(''); setDate(''); }} accessibilityLabel={i18n.t('reset_filters') || 'Réinitialiser'}>
          {i18n.t('reset_filters') || 'Réinitialiser'}
        </Button>
      </View>
      <List.Section>
        {filtered.length === 0 ? (
          <Text style={styles.noResult}>{i18n.t('no_results') || 'Aucun résultat'}</Text>
        ) : (
          filtered.map(course => (
            <List.Item
              key={course.id}
              title={course.title}
              description={`${course.category} • ${course.theme} • ${course.date}`}
              accessibilityLabel={`${course.title}, ${course.category}, ${course.theme}, ${course.date}`}
              style={styles.resultItem}
              right={props => <List.Icon {...props} icon="book" />}
            />
          ))
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