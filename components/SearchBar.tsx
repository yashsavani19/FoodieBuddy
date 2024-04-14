import Colors from "@/constants/Colors";
import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

interface SearchBarProps {
  onSearchSubmit: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchSubmit }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (newSearchTerm: string) => {
    console.log(`Search term: ${searchTerm}`);
    setSearchTerm(newSearchTerm);
    onSearchSubmit(searchTerm);
  };

  return (
    <TextInput
      style={styles.input}
      placeholder="Search..."
      value={searchTerm}
      onChangeText={() => handleSearchSubmit(searchTerm)}
    />
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 10,
    paddingLeft: 10,
    backgroundColor: Colors.light.background,
  },
});
