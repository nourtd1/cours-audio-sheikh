import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, I18nManager, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CourseItem({ title, number, isFavorite, onFavoritePress, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onFavoritePress} style={styles.heartBtn} hitSlop={{top:10,bottom:10,left:10,right:10}}>
          <MaterialCommunityIcons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={28}
            color="#a11d2a"
          />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <View style={styles.badge}>
          {/* Si tu as un motif décoratif, ajoute-le ici, par exemple :
          <Image source={require('../assets/badge-decor.png')} style={styles.badgeDecor} />
          */}
          <Text style={styles.badgeText}>{number}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  row: { flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', alignItems: 'center' },
  heartBtn: { marginHorizontal: 6 },
  title: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontFamily: 'Amiri',
    marginHorizontal: 8,
  },
  badge: {
    backgroundColor: '#f3e9e9',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#a11d2a',
    overflow: 'hidden',
  },
  badgeText: { color: '#a11d2a', fontSize: 16, fontWeight: 'bold', fontFamily: 'Amiri' },
  // badgeDecor: { ... }, // à définir si tu ajoutes un motif décoratif SVG ou PNG
}); 