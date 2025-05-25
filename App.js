import * as React from 'react';
import { I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import CourseListScreen from './screens/CourseListScreen';
import AudioPlayerScreen from './screens/AudioPlayerScreen';
import PDFViewerScreen from './screens/PDFViewerScreen';
import SearchScreen from './screens/SearchScreen';
import i18n from './utils/i18n';

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
  React.useEffect(() => {
    if (i18n.locale.startsWith('ar')) {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: i18n.t('home') }} />
          <Stack.Screen name="Courses" component={CourseListScreen} options={{ title: i18n.t('courses') }} />
          <Stack.Screen name="Audio" component={AudioPlayerScreen} options={{ title: i18n.t('audio') }} />
          <Stack.Screen name="PDF" component={PDFViewerScreen} options={{ title: i18n.t('pdf') }} />
          <Stack.Screen name="Search" component={SearchScreen} options={{ title: i18n.t('search') }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
