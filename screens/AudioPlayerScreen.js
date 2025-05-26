// screens/AudioPlayerScreen.js
import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { Text, Button, ProgressBar, IconButton, Card } from 'react-native-paper';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import i18n from '../utils/i18n';
import { LanguageContext } from '../App';

const STORAGE_KEY = 'AUDIO_PLAYER_POSITION';

const AudioPlayerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { locale } = useContext(LanguageContext);
  const { course } = route.params || {};
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(true);

  // Charger la position sauvegardée
  useEffect(() => {
    const loadPosition = async () => {
      try {
        const saved = await AsyncStorage.getItem(`${STORAGE_KEY}_${course?.id}`);
        if (saved) setPosition(Number(saved));
      } catch {}
    };
    loadPosition();
  }, [course?.id]);

  // Charger et préparer le son
  useEffect(() => {
    let isMounted = true;
    const loadSound = async () => {
      setLoading(true);
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: course.audioUrl },
        { shouldPlay: false, positionMillis: position },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      setLoading(false);
    };
    if (course?.audioUrl) loadSound();
    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
    // eslint-disable-next-line
  }, [course?.audioUrl]);

  // Sauvegarder la position
  useEffect(() => {
    if (!course?.id) return;
    AsyncStorage.setItem(`${STORAGE_KEY}_${course.id}`, String(position));
  }, [position, course?.id]);

  // Gestion du statut de lecture
  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) return;
    setPosition(status.positionMillis);
    setDuration(status.durationMillis || 1);
    setIsPlaying(status.isPlaying);
  };

  // Contrôles
  const handlePlayPause = async () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };
  const handleSeek = async (ms) => {
    if (!soundRef.current) return;
    let newPos = Math.max(0, Math.min(position + ms, duration));
    await soundRef.current.setPositionAsync(newPos);
    setPosition(newPos);
  };
  const handleSliderChange = async (value) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(value * duration);
    setPosition(value * duration);
  };

  // Accessibilité : annonce le titre
  useEffect(() => {
    if (course?.title) {
      AccessibilityInfo.announceForAccessibility(course.title);
    }
  }, [course?.title]);

  useEffect(() => {
    navigation.setOptions({ title: i18n.t('audio.title') });
  }, [locale, navigation]);

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(500)}>
      <Card style={styles.card} accessible accessibilityLabel={course?.title}>
        <Card.Content>
          <Text style={styles.title}>{course?.title}</Text>
        </Card.Content>
      </Card>
      <View style={styles.controls}>
        <IconButton
          icon="rewind-10"
          size={36}
          onPress={() => handleSeek(-10000)}
          accessibilityLabel={i18n.t('audio.rewind_10s') || 'Reculer 10 secondes'}
        />
        <IconButton
          icon={isPlaying ? 'pause' : 'play'}
          size={48}
          onPress={handlePlayPause}
          accessibilityLabel={isPlaying ? i18n.t('audio.pause') || 'Pause' : i18n.t('audio.play') || 'Lecture'}
          disabled={loading}
        />
        <IconButton
          icon="fast-forward-10"
          size={36}
          onPress={() => handleSeek(10000)}
          accessibilityLabel={i18n.t('audio.forward_10s') || 'Avancer 10 secondes'}
        />
      </View>
      <TouchableOpacity
        accessible
        accessibilityLabel={i18n.t('audio.progress_bar') || 'Barre de progression'}
        accessibilityRole="adjustable"
        style={styles.progressContainer}
        onPress={async (e) => {
          const { locationX, width } = e.nativeEvent;
          const percent = locationX / width;
          await handleSliderChange(percent);
        }}
      >
        <ProgressBar
          progress={position / duration}
          color="#1976d2"
          style={styles.progressBar}
        />
        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatMillis(position)}</Text>
          <Text style={styles.time}>{formatMillis(duration)}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

function formatMillis(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
});

export default AudioPlayerScreen; 