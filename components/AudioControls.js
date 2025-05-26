import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, ProgressBar, Text } from 'react-native-paper';
import i18n from '../utils/i18n';

const AudioControls = ({
  isPlaying,
  position,
  duration,
  onPlayPause,
  onSeek,
  onSliderChange,
  loading,
}) => {
  return (
    <View style={styles.controls}>
      <IconButton
        icon="rewind-10"
        size={36}
        onPress={() => onSeek(-10000)}
        accessibilityLabel={i18n.t('rewind_10s') || 'Reculer 10 secondes'}
      />
      <IconButton
        icon={isPlaying ? 'pause' : 'play'}
        size={48}
        onPress={onPlayPause}
        accessibilityLabel={isPlaying ? i18n.t('pause') || 'Pause' : i18n.t('play') || 'Lecture'}
        disabled={loading}
      />
      <IconButton
        icon="fast-forward-10"
        size={36}
        onPress={() => onSeek(10000)}
        accessibilityLabel={i18n.t('forward_10s') || 'Avancer 10 secondes'}
      />
      <ProgressBar
        progress={position / duration}
        color="#1976d2"
        style={styles.progressBar}
      />
      <View style={styles.timeRow}>
        <Text style={styles.time}>{formatMillis(position)}</Text>
        <Text style={styles.time}>{formatMillis(duration)}</Text>
      </View>
    </View>
  );
};

function formatMillis(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    marginTop: 8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 4,
    width: '100%',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
});

export default AudioControls; 