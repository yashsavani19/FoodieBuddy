import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

interface EditTextFieldProps {
  title?: string;
  onSubmit?: (text: string) => void;
}

const EditTextField: React.FC<EditTextFieldProps> = ({ title, onSubmit }) => {
  const [editMode, setEditMode] = React.useState(false);
  const [text, setText] = React.useState(title || "");
  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        editable={editMode}
        selectTextOnFocus={true}
        style={styles.input}
        placeholder={text}
      />
      <View style={styles.buttonContainer}>
        {editMode ? (
          <AntDesign
            name="check"
            size={24}
            color="black"
            onPress={() => {
              if (onSubmit) onSubmit(text || "");
              setEditMode(false);
            }}
          />
        ) : (
          <AntDesign
            name="edit"
            size={24}
            color="black"
            onPress={() => {
              setEditMode(true);
            }}
          />
        )}
      </View>
    </View>
  );
};

export default EditTextField;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    justifyContent: "center",
    alignContent: "center",
    marginRight: 10,
  },
});
