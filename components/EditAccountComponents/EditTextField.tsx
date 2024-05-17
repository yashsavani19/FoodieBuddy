import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  Button,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef } from "react";

// Define the props for the EditTextField component
interface EditTextFieldProps {
  title?: string;
  placeholder?: string;
  isSecure?: boolean;
  isVisible: boolean;
  enableButton?: boolean;
  onSubmit?: (text: string) => void;
  onUpdatePress?: () => void;
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
  enableButton,
  onSubmit,
  onUpdatePress,
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

  const handlePress = () => {
    console.log("Update pressed");
    if (onUpdatePress) onUpdatePress();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        {isVisible && (
          <>
            <TextInput
              value={text}
              secureTextEntry={isSecure}
              onChangeText={(input) => {
                if (onSubmit) onSubmit(input);
                setText(input);
              }}
              selectTextOnFocus={true}
              style={styles.input}
              placeholder={placeholder}
            />
            <>
              {onUpdatePress && (
                <TouchableOpacity
                  style={[
                    styles.updateButton,
                    { backgroundColor: enableButton ? "#f26722" : "grey" },
                  ]}
                  disabled={!enableButton}
                  onPress={handlePress}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    Update
                  </Text>
                </TouchableOpacity>
              )}
            </>
          </>
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
    borderRadius: 10,
  },
  updateButton: {
    alignSelf: "flex-end",
    alignItems: "center",
    padding: 10,
    marginRight: 12,
    width: 100,
    borderRadius: 10,
  },
});
