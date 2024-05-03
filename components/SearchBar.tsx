import Colors from "@/constants/Colors";
import { AppContext } from "@/context/AppContext";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";

// Define the props for the SearchBar component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={18} style={{ marginRight: 12 }} {...props} />;
}

// Define the props for the SearchBar component
interface SearchBarProps {
  onSearchSubmit: (searchTerm: string) => void;
}

/**
 * SearchBar component that displays the search bar
 * @param param0 - onSearchSubmit
 * @returns - SearchBar component
 */
const SearchBar: React.FC<SearchBarProps> = ({ onSearchSubmit }) => {
  const { searchTerm, setSearchTerm } = useContext(AppContext);

  // Function to handle search submit
  const handleSearchSubmit = () => {
    onSearchSubmit(searchTerm);
  };

  // Function to handle search clear
  const handleSearchClear = () => {
    setSearchTerm("");
    onSearchSubmit("");
  };

  // Function to handle key press
  const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (event.nativeEvent.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Search input */}
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearchSubmit}
          onKeyPress={handleKeyPress}
        />
        {searchTerm && (
          <TouchableOpacity
            style={{ justifyContent: "center" }}
            onPress={() => handleSearchClear()}
          >
            <TabBarIcon name="close" color={Colors.dark.iconColor} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={{ justifyContent: "center" }}
        onPress={() => handleSearchSubmit()}
      >
        <TabBarIcon name="search" color={Colors.dark.iconColor} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 10,
    paddingLeft: 10,
    backgroundColor: Colors.light.background,
  },
  messagesList: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
