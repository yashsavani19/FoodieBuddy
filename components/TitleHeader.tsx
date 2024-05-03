import React, { useContext } from "react";
import { StyleSheet, View, Image } from "react-native";
import Colors from "@/constants/Colors";
import images from "@/assets/data/images";
import HeaderComponents from "./HeaderComponents";
import { Category } from "@/model/Category";
import { Filter } from "@/model/Filter";
import Constants from "expo-constants";
import { AppContext } from "@/context/AppContext";
interface TitleHeaderProps {
  title?: string;
  searchBar?: boolean;
  onSearchSubmit?: (searchTerm: string) => void;
  onCategorySelect?: (category: Category) => void;
  onFilterSelect?: (filter: Filter[]) => void;
  searchTerm?: string;
  selectedCategory?: Category;
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
  const { searchTerm, selectedCategory } = useContext(AppContext);

  // Function to handle search submit
  const handleSearchSubmit = (searchTerm: string) => {
    console.log(`Title Header Search term: ${searchTerm}`);
    if (onSearchSubmit) {
      onSearchSubmit(searchTerm);
    }
  };

  //  Function to handle category select
  const handleCategorySelect = (category: Category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  // Function to handle filter select
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
        searchTerm={searchTerm} // Pass the current search term
        selectedCategory={selectedCategory} // Pass the current selected category
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
    justifyContent: "center",
    backgroundColor: Colors.light.headerBackground,
    alignItems: "center",
    borderTopWidth: Constants.statusBarHeight,
    borderTopColor: Colors.light.headerBackground,
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
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginHorizontal: 8,
    marginRight: 15,
  },
});
