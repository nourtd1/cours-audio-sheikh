import React from 'react';
import { View, TextInput } from 'react-native';

const SearchBar = ({ value, onChangeText, placeholder }) => (
  <View style={{ padding: 8 }}>
    <TextInput
      style={{ backgroundColor: '#f0f0f0', borderRadius: 8, padding: 8 }}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      accessible
      accessibilityLabel={placeholder}
    />
  </View>
);

export default SearchBar; 