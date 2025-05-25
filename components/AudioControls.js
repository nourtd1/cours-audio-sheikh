import React from 'react';
import { View, Button } from 'react-native';

const AudioControls = ({ onPlay, onPause }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 8 }}>
    <Button title="Play" onPress={onPlay} accessibilityLabel="Play audio" />
    <Button title="Pause" onPress={onPause} accessibilityLabel="Pause audio" />
  </View>
);

export default AudioControls; 