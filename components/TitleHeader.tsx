import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TextInput } from "react-native";
import Colors from "@/constants/Colors";
import SearchBar from "@/components/SearchBar";
import Categories from "@/components/Categories";
import Filters from "@/components/Filters";
import images from "@/assets/data/images";
import HeaderComponents from "./HeaderComponents";
import { Category } from "@/model/Category";
import { Filter } from "@/model/Filter";

interface TitleHeaderProps {
  title?: string;
  searchBar?: boolean;
  onSearchSubmit?: (searchTerm: string) => void; // This will be called when the user submits the search term
  onCategorySelect?: (category: Category) => void; // This will be called when the user selects a category
  onFilterSelect?: (filter: Filter[]) => void; // This will be called when the user selects a filter
}

/**
 * Title header component for the app
 * @param param0 String title for the header
 * @returns Title header component
 */
export default function TitleHeader({
  title,
  searchBar,
  onSearchSubmit,
  onCategorySelect,
  onFilterSelect,
}: TitleHeaderProps) {
  const handleSearchSubmit = (searchTerm: string) => {
    console.log(`Title Header Search term: ${searchTerm}`);
    if (onSearchSubmit) {
      onSearchSubmit(searchTerm);
    }
  };

  const handleCategorySelect = (category: Category) => {
    console.log(`Category selected: ${category}`);
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const handleFilterSelect = (filter: Filter[]) => {
    console.log(`Filter selected: ${filter}`);
    if (onFilterSelect) {
      onFilterSelect(filter);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: images.logo }} style={styles.image} />
      <HeaderComponents
        title={title}
        searchBar={searchBar}
        onSearchSubmit={handleSearchSubmit}
        onCategorySelect={handleCategorySelect}
        onFilterSelect={handleFilterSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    height: 120,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: Colors.light.headerBackground,
  },
  title: {
    width: "70%",
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlignVertical: "center",
    margin: "auto",
    paddingHorizontal: "17%",
    paddingTop: 10,
  },
  image: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    marginLeft: 15,
    margin: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 10,
    paddingLeft: 10,
  },
});
