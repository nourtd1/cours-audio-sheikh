import React, { useEffect } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Simule le chargement (12 secondes)
    const timer = setTimeout(() => {
      navigation.replace('Home'); // Navigue vers l'écran principal (à adapter selon ta stack)
    }, 12000); // 12 000 ms = 12 secondes
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/background-placeholder.png')} // Remplace par ton image décorative
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.centerContent}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../assets/sheikh-placeholder.png')} // Remplace par la photo du Sheikh
              style={styles.avatar}
            />
          </View>
        </View>
        <View style={styles.loadingSection}>
          <Text style={styles.loadingText}>المرجو الإنتظار...</Text>
          <ActivityIndicator size="large" color="#333" style={styles.loader} />
        </View>
        <View style={styles.bottomContent}>
          <Image
            source={require('../assets/headphones-placeholder.png')} // Remplace par ton icône casque
            style={styles.headphones}
          />
          <Text style={styles.bottomText}>إستعمل سماعات الرأس من أجل تجربة رائعة</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  background: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  centerContent: {
    alignItems: 'center',
    marginTop: 80,
  },
  avatarWrapper: {
    borderWidth: 6,
    borderColor: '#fff',
    borderRadius: 80,
    padding: 6,
    backgroundColor: '#fff',
    elevation: 6,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  loadingSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    fontSize: 22,
    color: '#333',
    fontFamily: 'Amiri', // Assure-toi d'ajouter la police Amiri dans assets/fonts
    marginBottom: 16,
    textAlign: 'center',
  },
  loader: {
    marginBottom: 16,
  },
  bottomContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headphones: {
    width: 36,
    height: 36,
    marginBottom: 8,
    tintColor: '#333',
  },
  bottomText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Amiri',
    textAlign: 'center',
  },
}); 