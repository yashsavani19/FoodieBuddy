import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
} from "react-native";
import RestaurantListItem from "@/components/RestaurantListItem";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import TitleHeader from "@/components/TitleHeader";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";

export default function HomeView() {
  const { 
    searchFilterRestaurants, 
    categoryFilterRestaurants, 
    selectedCategory, setSelectedCategory,
    searchTerm, setSearchTerm,
    filteredRestaurants, 
    dataLoading, restaurantListIsLoading } = useContext(AppContext);

  // Handle filtering of restaurants based on search term and selected category
  useEffect(() => {
    categoryFilterRestaurants();
  }, [selectedCategory]);

  useEffect(() => {
    searchFilterRestaurants();
  }, [searchTerm]);

  // Check if there are no matches and display an alert message
  useEffect(() => {
    if (!filteredRestaurants.length && !restaurantListIsLoading && !dataLoading && searchTerm.trim() !== "") {
      Alert.alert(
        "No Matches Found",
        "Sorry, no restaurants match your search criteria. Showing all restaurants instead.",
        [
          {
            text: "OK",
            onPress: () => setSearchTerm("") // Clear the search term
          }
        ]
      );
    }
  }, [filteredRestaurants, restaurantListIsLoading, dataLoading, searchTerm]);
  
  return (
    <View style={{ flex: 1 }}>
      <TitleHeader
        searchBar={true} 
        onSearchSubmit={setSearchTerm}
        onCategorySelect={setSelectedCategory}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
      />
      <View style={styles.background}>
        {restaurantListIsLoading || dataLoading ? (
          <View
            style={{
              backgroundColor: Colors.light.headerBackground,
              justifyContent: "center",
              flex: 1,
            }}
          >
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
          <FlatList
            data={filteredRestaurants}
            renderItem={({ item }) => <RestaurantListItem restaurant={item} />}
            contentContainerStyle={{ gap: 3 }}
          />
        )}
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
  noMatches: {},
});
