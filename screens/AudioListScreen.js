import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import audioFiles from '../audioFiles.json';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'AUDIO_FAVORITES';

const AudioListScreen = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [sound, setSound] = useState();
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const progressInterval = useRef(null);
  const [favorites, setFavorites] = useState([]);

  // Charger les favoris au démarrage
  React.useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY).then(data => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  // Sauvegarder les favoris à chaque modification
  React.useEffect(() => {
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const playAudio = async (url, index) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(undefined);
      }
      setIsPlaying(true);
      setCurrentIndex(index);
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
      setSound(newSound);
      await newSound.playAsync();
      const status = await newSound.getStatusAsync();
      setDuration(status.durationMillis || 1);
      setPosition(status.positionMillis || 0);
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
    } catch (error) {
      setIsPlaying(false);
      setCurrentIndex(null);
      alert('Erreur lors de la lecture audio : ' + (error && error.message ? error.message : JSON.stringify(error)));
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeAudio = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(undefined);
      setIsPlaying(false);
      setCurrentIndex(null);
      setPosition(0);
    }
  };

  const seekAudio = async (ms) => {
    if (sound) {
      let newPosition = position + ms;
      if (newPosition < 0) newPosition = 0;
      if (newPosition > duration) newPosition = duration;
      await sound.setPositionAsync(newPosition);
      setPosition(newPosition);
    }
  };

  const toggleFavorite = (audio) => {
    setFavorites((prev) => {
      const exists = prev.find(f => f.url === audio.url);
      if (exists) {
        return prev.filter(f => f.url !== audio.url);
      } else {
        return [...prev, audio];
      }
    });
  };

  const renderControls = (index) => {
    if (currentIndex !== index) return null;
    return (
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => seekAudio(-10000)}>
          <MaterialCommunityIcons name="rewind-10" size={32} color="#1976d2" />
        </TouchableOpacity>
        {isPlaying ? (
          <TouchableOpacity onPress={pauseAudio}>
            <MaterialCommunityIcons name="pause-circle" size={40} color="#1976d2" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={resumeAudio}>
            <MaterialCommunityIcons name="play-circle" size={40} color="#1976d2" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => seekAudio(10000)}>
          <MaterialCommunityIcons name="fast-forward-10" size={32} color="#1976d2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={stopAudio}>
          <MaterialCommunityIcons name="stop-circle" size={32} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderProgress = (index) => {
    if (currentIndex !== index) return null;
    return (
      <View style={styles.progressBarWrapper}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBar, { width: `${(position / duration) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {Math.floor(position / 1000)}s / {Math.floor(duration / 1000)}s
        </Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#e0eafc", "#cfdef3", "#f8fafc"]} start={{x:0.2,y:0}} end={{x:1,y:1}} style={{flex:1}}>
      <View style={styles.container}>
        <Text style={styles.title}>قائمة الدروس الصوتية</Text>
        <FlatList
          data={audioFiles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeIn.duration(500)} style={styles.cardWrapper}>
              <View style={styles.itemRow}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name="music" size={24} color="#a11d2a" />
                </View>
                <View style={styles.itemContent}>
                  <TouchableOpacity
                    style={({ pressed }) => [styles.touchable, pressed && styles.touchablePressed]}
                    onPress={() =>
                      currentIndex === index && isPlaying ? pauseAudio() : playAudio(item.url, index)
                    }
                    activeOpacity={0.85}
                  >
                    <Text style={styles.itemText}>{item.titre}</Text>
                    <Text style={styles.descText}>{item.description}</Text>
                    {currentIndex === index && isPlaying && <ActivityIndicator size="small" color="#007AFF" />}
                  </TouchableOpacity>
                  {renderControls(index)}
                  {renderProgress(index)}
                </View>
                <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(item)}>
                  <MaterialCommunityIcons
                    name={favorites.find(f => f.url === item.url) ? 'heart' : 'heart-outline'}
                    size={28}
                    color="#a11d2a"
                  />
                </TouchableOpacity>
                <View style={styles.badgeWrapper}>
                  <Animated.View style={styles.badgeGradient}>
                    <Text style={styles.badgeText}>{index + 1}</Text>
                  </Animated.View>
                </View>
              </View>
            </Animated.View>
          )}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
        />
        <View style={styles.adBanner}>
          <Text style={styles.adText}>مساحة الوحدة الإعلانية المحجوزة</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Amiri',
    color: '#222',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 1,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginRight: 10,
    marginLeft: 0,
  },
  itemContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  touchable: {
    width: '100%',
  },
  touchablePressed: {
    shadowColor: '#1976d2',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 8,
  },
  progressBarWrapper: {
    marginTop: 8,
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#1976d2',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  adBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    height: 48,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 12,
  },
  adText: { color: '#aaa', textAlign: 'center', fontSize: 13, marginTop: 18 },
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
    backgroundColor: 'linear-gradient(135deg, #FFD700 60%, #FFF8DC 100%)',
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
  itemText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    fontFamily: 'Amiri',
    marginBottom: 2,
  },
  descText: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
    marginBottom: 6,
    textAlign: 'center',
    fontFamily: 'Amiri',
  },
  favBtn: {
    marginLeft: 8,
    marginRight: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AudioListScreen; 