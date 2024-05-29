import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SavePreferenceButtonProps {
  onSave: () => void;
}

const SavePreferenceButton: React.FC<SavePreferenceButtonProps> = ({ onSave }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onSave}>
      <Text style={styles.buttonText}>Save Preferences</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    width: 130,
    height: 40,
    marginBottom: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,

  },
});

export default SavePreferenceButton;
