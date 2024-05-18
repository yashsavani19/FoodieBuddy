import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Icon } from "react-native-vector-icons/Icon";
import { Line } from "react-native-svg";

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
      <View style={styles.container}>
        <Text style={styles.labelText}>{title}</Text>
        <View style={{ justifyContent: "center" }}>
          {!editMode ? (
            <TouchableOpacity
              onPress={() => {
                setEditMode(true);
              }}
            >
              <Image
                source={require("../../assets/images/edit_button.png")}
                style={{ width: 18, height: 18, marginRight: 3, marginTop: 3 }}
              />
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
      <View style={styles.dividerHorizontal} />
    </View>
  );
};

export default TitleButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 25,
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
  },
  inputContainer: {
    margin: 12,
  },
  dividerHorizontal: {
    borderBottomColor: "#a6a6a6",
    borderBottomWidth: 2,
    marginTop: 5,
    marginHorizontal: 25,
  },
});
