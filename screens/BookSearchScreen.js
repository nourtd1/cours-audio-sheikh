import React, { useState, useEffect } from 'react';
import { View, I18nManager } from 'react-native';
import { TextInput, List, Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import bookData from '../assets/data/book.json';

const getExcerpt = (content, keyword) => {
  const idx = content.indexOf(keyword);
  if (idx === -1) return content.slice(0, 200) + (content.length > 200 ? '...' : '');
  const start = Math.max(0, idx - 30);
  const end = Math.min(content.length, idx + keyword.length + 170);
  let excerpt = content.slice(start, end);
  if (start > 0) excerpt = '...' + excerpt;
  if (end < content.length) excerpt = excerpt + '...';
  return excerpt;
};

const BookSearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const lower = query.toLowerCase();
    setResults(
      bookData.filter(chap => chap.content.toLowerCase().includes(lower))
    );
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <TextInput
        mode="outlined"
        placeholder="Recherche dans le livre..."
        value={query}
        onChangeText={setQuery}
        style={{ marginBottom: 16, direction: I18nManager.isRTL ? 'rtl' : 'ltr' }}
        accessibilityLabel="Champ de recherche dans le livre"
        textAlign={I18nManager.isRTL ? 'right' : 'left'}
      />
      {results.length === 0 && query ? (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: 32 }}>Aucun résultat</Text>
      ) : (
        <List.Section>
          {results.map(chap => (
            <Card
              key={chap.id}
              style={{ marginBottom: 12 }}
              onPress={() => navigation.navigate('Book', { chapterId: chap.id, highlight: query })}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Aller au chapitre ${chap.title}`}
            >
              <Card.Title
                title={chap.title}
                titleStyle={{ textAlign: I18nManager.isRTL ? 'right' : 'left' }}
              />
              <Card.Content>
                <Text style={{ color: '#444', textAlign: I18nManager.isRTL ? 'right' : 'left' }}>
                  {getExcerpt(chap.content, query)}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </List.Section>
      )}
    </View>
  );
};

export default BookSearchScreen; 