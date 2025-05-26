import React, { useState, useContext, useEffect } from 'react';
import { View, I18nManager, StyleSheet } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import i18n from '../utils/i18n';
import { LanguageContext } from '../App';

const LANGS = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
];

const LanguageSelector = () => {
  const { locale, changeLanguage } = useContext(LanguageContext);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(locale);

  useEffect(() => {
    setSelected(locale);
  }, [locale]);

  const handleSelect = (lang) => {
    changeLanguage(lang);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setVisible(true)} accessibilityLabel={i18n.t('settings.language')}>
            {i18n.t('settings.select_language')}
          </Button>
        }
      >
        {LANGS.map(l => (
          <Menu.Item key={l.code} onPress={() => handleSelect(l.code)} title={l.label} />
        ))}
      </Menu>
      <Text style={[styles.current, selected === 'ar' && { fontFamily: 'Amiri', textAlign: 'right' }]}>
        {i18n.t('settings.language')}: {LANGS.find(l => l.code === selected)?.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  current: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
});

export default LanguageSelector; 