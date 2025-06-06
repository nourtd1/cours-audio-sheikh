console.log('utils/i18n.js loaded');
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from '../locales/en';
import fr from '../locales/fr';
import ar from '../locales/ar';

const i18n = new I18n({
  en,
  fr,
  ar,
});

i18n.locale = Localization.locale?.split('-')[0] || 'fr';
i18n.enableFallback = true;

i18n.setLocale = (locale) => {
  i18n.locale = locale;
};

console.log('i18n instance:', i18n);

export default i18n; 
