# الشيخ أحمد النور محمد الحلوا — Application Mobile

Application mobile multiplateforme (Android & iOS) pour écouter les cours audio (hébergés sur GitHub) et lire/rechercher dans le livre du Sheikh Ahmad Nour Mohammad Al-Halwa.

## Fonctionnalités principales

- **Liste des cours audio** : Parcours, recherche, lecture (streaming via GitHub/jsDelivr) et téléchargement des cours.
- **Lecteur audio** : Streaming, contrôle de la lecture, avance/retour rapide, lecture en arrière-plan.
- **Lecture et recherche dans le livre** : Recherche plein texte, navigation par chapitres, surlignage, sauvegarde de la progression (remplace l'ancien visualiseur PDF).
- **Recherche avancée** : Recherche par mots-clés, filtres par catégorie ou date.
- **Téléchargement hors ligne** : Accès aux cours et au livre sans connexion.
- **Support multilingue** : Interface en arabe (RTL), français et anglais, avec bascule de langue.

## Technologies utilisées

- **React Native** avec **Expo** (Android & iOS)
- **Firebase** (Cloud Storage & Firestore)
- **GitHub + jsDelivr** (hébergement des fichiers audio)
- **react-navigation** (navigation entre écrans)
- **react-native-paper** (UI)
- **i18n-js** (traductions multilingues)
- **expo-av** (audio)
- **expo-file-system**, **@react-native-async-storage/async-storage** (stockage local)
- **expo-notifications** (notifications push)
- **react-native-reanimated** (animations)
- **Police Amiri** pour l'arabe, **Roboto** pour les autres langues

## Structure du projet

```
/assets/           # Images, icônes, polices, données du livre (book.json)
/components/       # Composants réutilisables (CourseItem, AudioControls, etc.)
/locales/          # Fichiers de traduction (ar.js, fr.js, en.js)
/screens/          # Écrans principaux (HomeScreen, CourseListScreen, AudioListScreen, BookSearchScreen, BookReaderScreen, etc.)
/utils/            # Fonctions utilitaires (Firebase, audio, livre, etc.)
audioFiles.json    # Liste des fichiers audio (liens GitHub/jsDelivr)
App.js             # Point d'entrée de l'application
firebaseConfig.js  # Configuration Firebase
```

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone <url-du-repo>
   cd <nom-du-dossier>
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configurer Firebase**
   - Renseigner les clés dans `firebaseConfig.js` (fournies par l'équipe backend).

4. **Lancer l'application**
   ```bash
   npx expo start
   ```
   Scanner le QR code avec Expo Go (Android/iOS).

## Instructions de test

- **Android & iOS** : Testé via Expo Go sur Samsung et iPhone.
- **Accessibilité** : Compatible VoiceOver (iOS) et TalkBack (Android).
- **Multilingue** : Bascule de langue dans les paramètres, support RTL pour l'arabe.
- **Offline** : Tester le téléchargement et l'accès hors ligne aux contenus (audio et livre).

## Contraintes & Bonnes pratiques

- **Design épuré** : Couleurs sobres (blanc, vert islamique, gris).
- **Navigation intuitive** : Stack ou tabs via react-navigation.
- **Accessibilité** : Labels clairs, contraste élevé, navigation simplifiée.
- **Aucune logique backend** : Uniquement intégration du SDK Firebase et accès aux fichiers via GitHub.

## Dépendances principales

- expo
- react-native
- react-navigation
- react-native-paper
- i18n-js
- expo-av
- expo-file-system
- @react-native-async-storage/async-storage
- expo-notifications
- firebase
- react-native-reanimated

## Remarques

- Les fichiers audio sont hébergés sur GitHub et accessibles via jsDelivr (voir `audioFiles.json`).
- Le livre est stocké sous forme de fichier JSON et consultable/recherchable via l'écran BookSearchScreen.
- Toute la logique backend (stockage, notifications, etc.) est gérée par une autre équipe.
- L'application est destinée aux fidèles, étudiants en sciences islamiques, et toute personne intéressée par les enseignements du Sheikh. 