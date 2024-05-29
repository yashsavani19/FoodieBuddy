import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  Button,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useRef } from "react";

// Define the props for the EditTextField component
interface EditTextFieldProps {
  title?: string;
  placeholder?: string;
  isSecure?: boolean;
  isVisible: boolean;
  enableButton?: boolean;
  imageSrc: "username" | "email" | "password";
  onSubmit?: (text: string) => void;
  onUpdatePress?: () => void;
}

const editImages: { [key: string]: any } = {
  username: require("../../assets/images/user_icon_small.png"),
  email: require("../../assets/images/email_icon_small.png"),
  password: require("../../assets/images/password_icon_small.png"),
};

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
  imageSrc,
  onSubmit,
  onUpdatePress,
}) => {
  const [editMode, setEditMode] = React.useState(false);
  const [text, setText] = React.useState(title || "");
  const source = editImages[imageSrc];

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
            <View style={styles.input}>
              <Image resizeMode="contain" source={editImages[imageSrc]} style={styles.inputIcon} />
              <TextInput
                value={text}
                secureTextEntry={isSecure}
                onChangeText={(input) => {
                  if (onSubmit) onSubmit(input);
                  setText(input);
                }}
                selectTextOnFocus={true}
                placeholder={placeholder}
              />
            </View>
            <>
              {onUpdatePress && (
                <TouchableOpacity
                  style={[
                    styles.updateButton,
                    { backgroundColor: enableButton ? "#3464ac" : "grey" },
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
  inputContainer: {
    margin: 12,
  },
  input: {
    justifyContent: "flex-start",
    flexDirection: "row",
    height: 40,
    marginVertical: 12,
    marginHorizontal: 25,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  updateButton: {
    alignSelf: "flex-end",
    alignItems: "center",
    padding: 10,
    marginRight: 25,
    width: 100,
    borderRadius: 10,
  },
  inputIcon: {
    height: 20,
    width: 20,
    marginRight: 20,
  },
});
