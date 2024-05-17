import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";

// Define the props for the TitleButton component
interface TitleButtonProps {
  title?: string;
  mode?: boolean;
  onPress?: () => void;
  onEdit?: (isEdit: boolean) => void;
}

/**
 * Formatted title with an edit button for the EditAccountView
 * @param param0 Props for the TitleButton component
 * @returns Formatted title with an edit button
 */
const TitleButton: React.FC<TitleButtonProps> = ({
  title,
  mode,
  onPress,
  onEdit,
}) => {
  const [editMode, setEditMode] = React.useState(false);

  // Update the edit mode when the mode prop changes
  useEffect(() => {
    if (onEdit) {
      onEdit(editMode);
    }
  }, [editMode]);

  // Update the edit mode when the mode prop changes
  useEffect(() => {
    if (mode !== undefined && mode !== editMode) {
      setEditMode(mode);
    }
  }, [mode]);

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.labelText}>{title}</Text>
        <View style={{ marginHorizontal: 15 }}>
          {!editMode ? (
            <TouchableOpacity
              onPress={() => {
                setEditMode(true);
              }}
            >
              <AntDesign name="edit" size={24} color="grey" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setEditMode(false);
                if (onPress) onPress();
              }}
            >
              <AntDesign name="close" size={24} color="#f26722" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default TitleButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    marginTop: 120,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 20,
  },
  inputContainer: {
    margin: 12,
  },
});
