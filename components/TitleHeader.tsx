import React, { useContext } from "react";
import { StyleSheet, View, Image } from "react-native";
import Colors from "@/constants/Colors";
import images from "@/assets/data/images";
import HeaderComponents from "./HeaderComponents";
import { Category } from "@/model/Category";
import { Sort } from "@/model/Sort";
import Constants from "expo-constants";
import { AppContext } from "@/context/AppContext";
import ImFeelingLucky from "./ImFeelingLucky";

// Define the props for the TitleHeader component
interface TitleHeaderProps {
  title?: string;
  searchBar?: boolean;
  startupGuide?: boolean;
  onSearchSubmit?: (searchTerm: string) => void;
  onFiltersSelect?: (category: Category[]) => void;
  onSortSelect?: (sort: Sort) => void;
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
  startupGuide,
  onSearchSubmit,
  onFiltersSelect,
  onSortSelect,
}: TitleHeaderProps) {
  const { selectedSortOption, setSortOption } = useContext(AppContext);
  const { searchTerm, selectedFilters } = useContext(AppContext);

  // Function to handle search submit
  const handleSearchSubmit = (searchTerm: string) => {
    console.log(`Title Header Search term: ${searchTerm}`);
    if (onSearchSubmit) {
      onSearchSubmit(searchTerm);
    }
  };

  // Function to handle category select
  const handleFiltersSelect = (category: Category[]) => {
    if (onFiltersSelect) {
      onFiltersSelect(category);
    }
  };

  // Function to handle filter select
  const handleSortSelect = (toSort: Sort) => {
    if (onSortSelect) {
      onSortSelect(toSort);
    }
  };

  return (
    <View style={styles.container}>
      {onSearchSubmit ? (
        <ImFeelingLucky
          children={
            <Image source={{ uri: images.logo }} style={styles.image} />
          }
        />
      ) : (
        <Image source={{ uri: images.logo }} style={styles.image} />
      )}
      <HeaderComponents
        title={title}
        searchBar={searchBar}
        startupGuide={startupGuide}  // Pass startupGuide prop to HeaderComponents
        onSearchSubmit={handleSearchSubmit}
        onSortSelect={handleSortSelect}
        searchTerm={searchTerm} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    height: Constants.statusBarHeight + 100,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: Colors.light.headerBackground,
    alignItems: "center",
    borderTopColor: Colors.light.headerBackground,
    paddingTop: Constants.statusBarHeight,
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
