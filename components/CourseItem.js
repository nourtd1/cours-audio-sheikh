import React from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';

const CourseItem = ({
  title,
  category,
  theme,
  date,
  onPlay,
  onDownload,
}) => {
  return (
    <Card style={styles.card} accessible accessibilityLabel={`${title}, ${category}, ${theme}, ${date}`}>
      <Card.Content style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>{category} • {theme}</Text>
        <Text style={styles.date}>{date}</Text>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          mode="contained"
          onPress={onPlay}
          accessibilityLabel="Jouer le cours"
        >
          Jouer
        </Button>
        <Button
          mode="outlined"
          onPress={onDownload}
          style={styles.downloadBtn}
          accessibilityLabel="Télécharger le cours"
        >
          Télécharger
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  meta: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  actions: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  downloadBtn: {
    marginLeft: I18nManager.isRTL ? 0 : 8,
    marginRight: I18nManager.isRTL ? 8 : 0,
  },
});

export default CourseItem; 