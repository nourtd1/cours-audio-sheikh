import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, I18nManager, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CourseItem({ title, number, isFavorite, onFavoritePress, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onFavoritePress} style={styles.heartBtn} hitSlop={{top:10,bottom:10,left:10,right:10}}>
          <MaterialCommunityIcons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={28}
            color="#a11d2a"
          />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <View style={styles.badgeWrapper}>
          <Text style={styles.badgeText}>{number}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  row: { flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' },
  heartBtn: { marginHorizontal: 6 },
  title: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
    fontFamily: 'Amiri',
    marginHorizontal: 8,
  },
  badgeWrapper: {
    backgroundColor: '#f3e9e9',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#a11d2a',
    overflow: 'hidden',
  },
  badgeText: {
    color: '#a11d2a',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Amiri',
    zIndex: 2,
  },
}); 