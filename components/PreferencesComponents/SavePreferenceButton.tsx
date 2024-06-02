import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SavePreferenceButtonProps {
  onSave: () => void;
  saving: boolean;
}

const SavePreferenceButton: React.FC<SavePreferenceButtonProps> = ({ onSave, saving }) => {
  return (
    <TouchableOpacity style={[styles.button, saving ? styles.disabled : styles.enabled]} onPress={onSave}>
      <Text style={styles.buttonText}>Save Preferences </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    width: 130,
    height: 40,
    marginBottom: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,

  },
  enabled:
  {
    backgroundColor: '#007bff',
  },
  disabled:{
    backgroundColor: '#ccc',
  }
  
});

export default SavePreferenceButton;
