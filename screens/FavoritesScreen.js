import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const mockFavorites = [
  { id: '1', title: 'تفسير سورة الفاتحة' },
  { id: '2', title: 'فقه الصلاة' },
  { id: '3', title: 'سيرة النبي' },
];

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>المفضلة</Text>
      <FlatList
        data={mockFavorites}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>لا يوجد عناصر مفضلة</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 28, fontFamily: 'Amiri', color: '#1976d2', marginBottom: 24, textAlign: 'center' },
  item: { backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, marginBottom: 12 },
  itemText: { fontSize: 20, fontFamily: 'Amiri', color: '#333' },
  empty: { textAlign: 'center', color: '#888', fontFamily: 'Amiri', marginTop: 32 },
}); 