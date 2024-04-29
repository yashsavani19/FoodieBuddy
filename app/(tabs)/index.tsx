import { Alert, FlatList, StyleSheet, Text} from "react-native";
import RestaurantListItem from "@/components/RestaurantListItem";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import TitleHeader from "@/components/TitleHeader";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { Category } from '@/model/Category';

export default function HomeView() {
  const { searchFilterRestaurants, categoryFilterRestaurants, showNoRestaurantsFoundAlert, selectedCategory, searchTerm, setSelectedCategory, setSearchTerm, filteredRestaurants } = useContext(AppContext);

  // Handle filtering of restaurants based on search term and selected category
  useEffect(() => {
    categoryFilterRestaurants();
  }, [selectedCategory]);

  useEffect(() => {
    searchFilterRestaurants();
  }, [searchTerm]);

  useEffect(() => {
    showNoRestaurantsFoundAlert();
  }, [filteredRestaurants]);

  return (
    <View style={{flex: 1}}>
      <TitleHeader 
        searchBar={true} 
        onSearchSubmit={setSearchTerm}
        onCategorySelect={setSelectedCategory}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
      />
      <View style={styles.background}>
        <FlatList
          data={filteredRestaurants}
          renderItem={({ item }) => <RestaurantListItem restaurant={item} />}
          contentContainerStyle={{ gap: 3 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    marginTop: 120,
  },
  noMatches: {

  }
});