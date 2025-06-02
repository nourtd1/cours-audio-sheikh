import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Share, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp, ZoomIn, BounceIn } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PARTICLE_COUNT = 18;

function GoldParticles() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const left = Math.random() * (SCREEN_WIDTH - 40) + 10;
        const top = Math.random() * 220 + 10;
        const size = Math.random() * 10 + 6;
        const opacity = Math.random() * 0.5 + 0.3;
        return (
          <Animated.View
            key={i}
            entering={FadeIn.duration(1200 + i * 30)}
            style={{
              position: 'absolute',
              left,
              top,
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: '#FFD700',
              opacity,
              shadowColor: '#FFD700',
              shadowOpacity: 0.18,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 1 },
              elevation: 2,
            }}
          />
        );
      })}
    </View>
  );
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = React.useState([]);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(null);
  const soundRef = React.useRef(null);
  const [position, setPosition] = React.useState(0);
  const [duration, setDuration] = React.useState(1);
  const [heartPressed, setHeartPressed] = React.useState(-1);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('AUDIO_FAVORITES').then(data => {
        if (data) setFavorites(JSON.parse(data));
        else setFavorites([]);
      });
      return () => {
        if (soundRef.current) {
          soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        setIsPlaying(false);
        setCurrentIndex(null);
      };
    }, [])
  );

  const removeFavorite = (audio, index) => {
    setHeartPressed(index);
    setTimeout(() => setHeartPressed(-1), 300);
    const newFavs = favorites.filter(f => f.url !== audio.url);
    setFavorites(newFavs);
    AsyncStorage.setItem('AUDIO_FAVORITES', JSON.stringify(newFavs));
  };

  const playAudio = async (url, index) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsPlaying(true);
      setCurrentIndex(index);
      setPosition(0);
      setDuration(1);
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
      soundRef.current = newSound;
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis || 0);
          setDuration(status.durationMillis || 1);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setCurrentIndex(null);
            setPosition(0);
          }
        }
      });
      await newSound.playAsync();
    } catch (error) {
      setIsPlaying(false);
      setCurrentIndex(null);
      alert('Erreur lors de la lecture audio : ' + (error && error.message ? error.message : JSON.stringify(error)));
    }
  };

  const pauseAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setIsPlaying(false);
      setCurrentIndex(null);
    }
  };

  const shareAudio = async (item) => {
    try {
      await Share.share({
        message: `${item.titre || item.title}\n${item.url}`
      });
    } catch (e) {
      alert('Erreur lors du partage');
    }
  };

  return (
    <LinearGradient colors={["#e0eafc", "#cfdef3", "#f8fafc"]} start={{x:0.2,y:0}} end={{x:1,y:1}} style={{flex:1}}>
      <GoldParticles />
      <View style={styles.container}>
        <Text style={styles.title}>المفضلة</Text>
        <View style={styles.separator} />
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => item.url || item.id || index.toString()}
          renderItem={({ item, index }) => (
            <Animated.View entering={SlideInUp.duration(600 + index*40)} style={styles.cardWrapper}>
              <View style={styles.itemRow}>
                <LinearGradient colors={["#fffbe6", "#fff"]} style={styles.iconCircle}>
                  <MaterialCommunityIcons name="music" size={28} color="#a11d2a" style={styles.musicIcon} />
                  <View style={styles.musicLight} />
                </LinearGradient>
                <View style={styles.itemContent}>
                  <TouchableOpacity
                    onPress={() =>
                      currentIndex === index && isPlaying ? pauseAudio() : playAudio(item.url, index)
                    }
                    style={{ width: '100%' }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.itemText}>{item.titre || item.title}</Text>
                    {currentIndex === index && isPlaying && (
                      <ActivityIndicator size="small" color="#1976d2" style={{ marginTop: 6 }} />
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => removeFavorite(item, index)}
                  style={styles.favBtn}
                  hitSlop={{top:10,bottom:10,left:10,right:10}}
                  activeOpacity={0.7}
                >
                  <Animated.View style={[styles.heartWrapper, heartPressed === index && styles.heartPressed]} entering={ZoomIn.duration(300)}>
                    <MaterialCommunityIcons name="heart" size={30} color="#a11d2a" />
                  </Animated.View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => shareAudio(item)}
                  style={styles.shareBtn}
                  hitSlop={{top:10,bottom:10,left:10,right:10}}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="share-variant" size={26} color="#1976d2" />
                </TouchableOpacity>
                <View style={styles.badgeWrapper}>
                  <LinearGradient colors={["#FFD700", "#FFF8DC"]} style={styles.badgeGradient}>
                    <Animated.Text entering={BounceIn.duration(700)} style={styles.badgeText}>{index + 1}</Animated.Text>
                  </LinearGradient>
                </View>
              </View>
            </Animated.View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>لا يوجد عناصر مفضلة</Text>}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
        />
        {favorites.length > 0 && (
          <Animated.View entering={BounceIn.duration(900)} style={styles.quoteWrapper}>
            <Text style={styles.quoteText}>
              <Text style={styles.quoteMark}>“</Text>
              <Text style={styles.quoteHighlight}>كل درس تحفظه هنا هو كنزك الخاص</Text>
              <Text style={styles.quoteMark}>”</Text>
            </Text>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Amiri',
    color: '#1976d2',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  separator: {
    width: 70,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFD700',
    marginVertical: 10,
    alignSelf: 'center',
    opacity: 0.8,
  },
  cardWrapper: { marginBottom: 22 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
    minHeight: 90,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginLeft: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  musicIcon: {
    zIndex: 2,
  },
  musicLight: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,215,0,0.13)',
    zIndex: 1,
  },
  itemContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  itemText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    fontFamily: 'Amiri',
    marginBottom: 2,
  },
  favBtn: {
    marginLeft: 8,
    marginRight: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 1 }],
    transitionDuration: '200ms',
  },
  heartPressed: {
    transform: [{ scale: 1.25 }],
    shadowColor: '#a11d2a',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  shareBtn: {
    marginLeft: 8,
    marginRight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0eafc',
    borderRadius: 14,
    padding: 6,
    elevation: 2,
  },
  badgeWrapper: {
    marginLeft: 10,
    marginRight: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 2,
    borderColor: '#bfa100',
  },
  badgeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Amiri',
    zIndex: 2,
    textShadowColor: '#bfa100',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  empty: { textAlign: 'center', color: '#888', fontFamily: 'Amiri', marginTop: 32 },
  quoteWrapper: {
    marginTop: 18,
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#FFD700',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quoteText: {
    fontFamily: 'Amiri',
    fontSize: 18,
    color: '#1976d2',
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  quoteMark: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 2,
  },
  quoteHighlight: {
    backgroundColor: '#fffbe6',
    borderRadius: 8,
    paddingHorizontal: 6,
    color: '#bfa100',
    fontWeight: 'bold',
    fontSize: 19,
  },
}); 