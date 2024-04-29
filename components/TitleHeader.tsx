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
import Constants from "expo-constants";

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
    height: 120,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: Colors.light.headerBackground,
    alignItems: "center",
    borderTopWidth: Constants.statusBarHeight,
    borderTopColor: Colors.light.headerBackground,
    paddingHorizontal: 3,
  },
  title: {
    width: "70%",
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlignVertical: "center",
    margin: 0,
    paddingHorizontal: "17%",
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginHorizontal: 8,
    marginRight: 15,
  },
});
