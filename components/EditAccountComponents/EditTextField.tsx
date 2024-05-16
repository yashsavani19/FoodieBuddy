import { View, TextInput, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef } from "react";

// Define the props for the EditTextField component
interface EditTextFieldProps {
  title?: string;
  placeholder?: string;
  isSecure?: boolean;
  isVisible: boolean;
  onSubmit?: (text: string) => void;
}

/**
 * Editable text field for the EditAccountView
 * @param param0 Props for the EditTextField component
 * @returns Editable text field
 */
const EditTextField: React.FC<EditTextFieldProps> = ({
  title,
  placeholder,
  isSecure,
  isVisible,
  onSubmit,
}) => {
  const [editMode, setEditMode] = React.useState(false);
  const [text, setText] = React.useState(title || "");

  const translateY = useRef(new Animated.Value(-8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setText(title || "");
  }, [title]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: isVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: isVisible ? 0 : -8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        {isVisible && (
          <TextInput
            value={text}
            secureTextEntry={isSecure}
            onChangeText={onSubmit}
            selectTextOnFocus={true}
            style={styles.input}
            placeholder={placeholder}
          />
        )}
      </Animated.View>
    </View>
  );
};

export default EditTextField;

const styles = StyleSheet.create({
  container: {},
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});
