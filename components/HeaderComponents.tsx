import Filters from "./Filters";
import Categories from "./Categories";
import SearchBar from "./SearchBar";
import { Text, View, StyleSheet } from "react-native";
import { Category } from "@/model/Category";
import { Filter } from "@/model/Filter";
import React from "react";

// Define the props for the HeaderComponents component
interface HeaderComponentsProps {
  title?: string;
  searchBar?: boolean;
  onSearchSubmit?: (searchTerm: string) => void;
  onCategorySelect?: (category: Category) => void;
  onFilterSelect?: (filter: Filter[]) => void;
  searchTerm?: string; 
  selectedCategory?: Category; 
}

/**
 * Header component that displays the title or search bar
 * @param param0 - title, searchBar, onSearchSubmit, onCategorySelect, onFilterSelect
 * @returns - Header component
 */
const HeaderComponents: React.FC<HeaderComponentsProps> = ({
  title,
  searchBar,
  onSearchSubmit,
  onCategorySelect,
  onFilterSelect,
}) => {
  const handleSearchSubmit = React.useCallback((searchTerm: string) => {
    if (onSearchSubmit) {
      onSearchSubmit(searchTerm);
    }
  }, [onSearchSubmit]);

  // Define the function to handle the category select
  const handleCategorySelect = (category: Category) => {
    console.log(`Category selected: ${category.name}`);
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  // Define the function to handle the filter select
  const handleFilterSelect = (filter: Filter[]) => {
    console.log(`Filter selected: ${filter}`);
    if (onFilterSelect) {
      onFilterSelect(filter);
    }
  };

  if (title) {
    return <Text style={styles.title}>{title}</Text>;
  }
  if (searchBar) {
    return (
      <View style={styles.container}>
        <SearchBar 
          onSearchSubmit={handleSearchSubmit} 
        />
        <View style={styles.filters}>
          <Categories 
            onCategorySelect={handleCategorySelect} 
          />
          <Filters onFilterSelect={handleFilterSelect} />
        </View>
      </View>
    );
  }
};

export default HeaderComponents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 14
  },
  title: {
    width: "70%",
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlignVertical: "center",
    marginLeft: "auto",
    // paddingHorizontal: "17%",
    marginRight: 20,
    textAlign: "center",
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
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10,
  },
});
