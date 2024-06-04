import Filters from "./SortButton";
import SearchBar from "./SearchBar";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
  Pressable,
} from "react-native";
import FilterButton from "./FilterDrawerComponents/FilterButton";
import { Category } from "@/model/Category";
import { Sort } from "@/model/Sort";
import React, { useContext, useEffect } from "react";
import DrawerContext from "@/context/DrawerContext";
import StartupGuideButton from "./StartupGuideButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import StartupGuide from "./modals/StartupGuide";

// Define the props for the HeaderComponents component
interface HeaderComponentsProps {
  title?: string;
  searchBar?: boolean;
  startupGuide?: boolean;
  onSearchSubmit?: (searchTerm: string) => void;
  onFiltersSelect?: (category: Category[]) => void;
  onSortSelect?: (sort: Sort) => void;
  searchTerm?: string;
  selectedCategory?: Category;
  toggleDrawer?: () => void;
  open?: boolean;
}

/**
 * Header component that displays the title or search bar
 * @param param0 - title, searchBar, onSearchSubmit, onCategorySelect, onFilterSelect
 * @returns - Header component
 */
const HeaderComponents: React.FC<HeaderComponentsProps> = ({
  title,
  searchBar,
  startupGuide,
  onSearchSubmit,
  onSortSelect,
}) => {
  const handleSearchSubmit = React.useCallback(
    (searchTerm: string) => {
      if (onSearchSubmit) {
        onSearchSubmit(searchTerm);
      }
    },
    [onSearchSubmit]
  );
  const [modalVisible, setModalVisible] = React.useState(false);

  // // Define the function to handle the category select
  // const handleCategorySelect = (category: Category) => {
  //   console.log(`Category selected: ${category.name}`);
  //   if (onCategorySelect) {
  //     onCategorySelect(category);
  //   }
  // };

  // Define the function to handle the filter select
  const handleSortSelect = (toSort: Sort) => {
    if (onSortSelect) {
      onSortSelect(toSort);
      console.log("Sorter Selected", toSort);
    }
  };

  if (title) {
    return (
      <View style={{ flexDirection: "row", flexShrink: 2 }}>
        <Text style={styles.title}>{title}</Text>
        {/* Startup guide button */}
        <Pressable onPress={() => setModalVisible(true)}>
          <Image
            source={require("@/assets/images/startup-guide-icon.png")}
            style={styles.startupGuide}
          />
          {/* Modal for the startup guide */}
          <Modal
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={{flex:1}}>
              <StartupGuide onClose={() => {setModalVisible(false)}}/>
            </View>
          </Modal>
        </Pressable>
      </View>
    );
  }

  const { open, setOpen } = useContext(DrawerContext);

  if (searchBar) {
    return (
      <SafeAreaView style={styles.container} testID="Search Bar">
        <SearchBar onSearchSubmit={handleSearchSubmit} />
        <View style={styles.filters}>
          {/* <Categories 
            onCategorySelect={handleCategorySelect} 
          /> */}
          <FilterButton onPress={() => setOpen(!open)} />
          <Filters onSortSelect={handleSortSelect} />
        </View>
      </SafeAreaView>
    );
  }
};

export default HeaderComponents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 14,
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
  startupGuide: {
    width: 40,
    height: 40,
    marginRight: 35,
  },
});
