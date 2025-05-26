import * as React from 'react';
import { I18nManager, TouchableOpacity, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import CourseListScreen from './screens/CourseListScreen';
import AudioPlayerScreen from './screens/AudioPlayerScreen';
import PDFViewerScreen from './screens/PDFViewerScreen';
import SearchScreen from './screens/SearchScreen';
import BookReaderScreen from './screens/BookReaderScreen';
import DownloadsScreen from './screens/DownloadsScreen';
import SplashScreen from './screens/SplashScreen';
import i18n from './utils/i18n';
import * as Notifications from 'expo-notifications';
import { Button as PaperButton } from 'react-native-paper';
import { Platform } from 'react-native';
import FavoritesScreen from './screens/FavoritesScreen';
import WebViewScreen from './screens/WebViewScreen';
import PolicyScreen from './screens/PolicyScreen';
import TasbihScreen from './screens/TasbihScreen';
import AllahNamesScreen from './screens/AllahNamesScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const LanguageContext = React.createContext();

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976d2',
    accent: '#ffb300',
  },
};

export default function App() {
  const [locale, setLocale] = React.useState(i18n.locale);
  // État pour savoir si le rappel quotidien est actif
  const [reminderActive, setReminderActive] = React.useState(false);

  const changeLanguage = (lang) => {
    i18n.setLocale(lang);
    setLocale(lang);
    if (lang === 'ar') {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
  };

  React.useEffect(() => {
    if (i18n.locale.startsWith('ar')) {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
    // Initialisation des notifications locales uniquement
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS !== 'web') {
      Notifications.requestPermissionsAsync();
    }
  }, [locale]);

  // Fonction pour envoyer une notification locale (exemple)
  const sendTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: "Ceci est une notification locale envoyée depuis l'app.",
      },
      trigger: null,
    });
  };

  // Fonction pour activer le rappel quotidien
  const enableDailyReminder = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Rappel',
        body: "N'oubliez pas d'écouter un cours aujourd'hui !"
      },
      trigger: { hour: 20, minute: 0, repeats: true }
    });
    setReminderActive(true);
  };

  // Fonction pour désactiver le rappel quotidien
  const disableDailyReminder = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    setReminderActive(false);
  };

  // Vérifie si un rappel est déjà programmé au lancement
  React.useEffect(() => {
    Notifications.getAllScheduledNotificationsAsync().then((notifs) => {
      setReminderActive(notifs.some(n => n.trigger && n.trigger.hour === 20));
    });
  }, []);

  // Ajout du bouton sur l'écran Home
  const HomeWithNotif = (props) => (
    <>
      <HomeScreen {...props} />
      <PaperButton
        mode="contained"
        style={{ margin: 16, alignSelf: 'center' }}
        onPress={sendTestNotification}
        accessibilityLabel="Envoyer une notification locale de test"
        icon="bell"
      >
        Envoyer une notification de test
      </PaperButton>
      <PaperButton
        mode={reminderActive ? 'outlined' : 'contained'}
        style={{ margin: 8, alignSelf: 'center' }}
        onPress={reminderActive ? disableDailyReminder : enableDailyReminder}
        accessibilityLabel={reminderActive ? 'Désactiver le rappel quotidien' : 'Activer le rappel quotidien'}
        icon={reminderActive ? 'bell-off' : 'bell'}
      >
        {reminderActive ? 'Désactiver le rappel quotidien' : 'Activer le rappel quotidien à 20h'}
      </PaperButton>
      <PaperButton
        mode="text"
        style={{ alignSelf: 'center' }}
        disabled
      >
        {reminderActive ? 'Rappel quotidien activé' : 'Rappel quotidien désactivé'}
      </PaperButton>
    </>
  );

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeWithNotif}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Courses"
              component={CourseListScreen}
              options={({ navigation }) => ({
                header: () => (
                  <View style={{
                    height: 56,
                    backgroundColor: '#444',
                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    paddingHorizontal: 8,
                    borderBottomWidth: 0.5,
                    borderColor: '#222',
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOpacity: 0.12,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                  }}>
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                      style={{ padding: 8, marginHorizontal: 4 }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <MaterialCommunityIcons
                        name={I18nManager.isRTL ? 'arrow-right' : 'arrow-left'}
                        size={28}
                        color="#fff"
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        flex: 1,
                        color: '#fff',
                        fontSize: 20,
                        textAlign: 'center',
                        fontFamily: 'Amiri',
                        letterSpacing: 0.5,
                        marginRight: I18nManager.isRTL ? 0 : 28,
                        marginLeft: I18nManager.isRTL ? 28 : 0,
                      }}
                      numberOfLines={1}
                    >
                      محاضرات راتب النابلسي بدون انترنت
                    </Text>
                    <View style={{ width: 36 }} />
                  </View>
                ),
              })}
            />
            <Stack.Screen name="Audio" component={AudioPlayerScreen} options={{ title: i18n.t('audio.title') }} />
            <Stack.Screen name="PDF" component={PDFViewerScreen} options={{ title: i18n.t('pdf.title') }} />
            <Stack.Screen name="Search" component={SearchScreen} options={{ title: i18n.t('search.title') }} />
            <Stack.Screen name="Book" component={BookReaderScreen} options={{ title: i18n.t('pdf.title') }} />
            <Stack.Screen name="Downloads" component={DownloadsScreen} options={{ title: i18n.t('downloads.title') }} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'المفضلة' }} />
            <Stack.Screen name="WebView" component={WebViewScreen} options={{ title: 'موقعنا' }} />
            <Stack.Screen name="Policy" component={PolicyScreen} options={{ title: 'سياسة التطبيق' }} />
            <Stack.Screen name="Tasbih" component={TasbihScreen} options={{ title: 'عدد التسبيحات' }} />
            <Stack.Screen name="AllahNames" component={AllahNamesScreen} options={{ title: 'أسماء الله الحسنى' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </LanguageContext.Provider>
  );
}
