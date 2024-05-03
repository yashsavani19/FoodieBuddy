import React, { FC, useContext, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";
import RestaurantListItem from "@/components/RestaurantListItem";
import { AppContext } from "@/context/AppContext";
import Colors from "@/constants/Colors";
import TitleHeader from "@/components/TitleHeader";

const HomeView: FC = () => {
  const { 
    searchFilterRestaurants, 
    categoryFilterRestaurants, 
    selectedCategory, setSelectedCategory,
    searchTerm, setSearchTerm,
    filteredRestaurants, 
    dataLoading, 
    restaurantListIsLoading,
    visitedRestaurants // Assuming you have a state for visited restaurants
  } = useContext(AppContext);

  // Handle filtering of restaurants based on search term and selected category
  useEffect(() => {
    categoryFilterRestaurants();
  }, [selectedCategory]);

  useEffect(() => {
    searchFilterRestaurants();
  }, [searchTerm]);

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
          <>
            {filteredRestaurants.length === 0 && (
              <View style={styles.noMatches}>
                <Text style={styles.titleText}>No matching restaurants found</Text>
              </View>
            )}
            <FlatList
              data={filteredRestaurants}
              renderItem={({ item }) => <RestaurantListItem restaurant={item} />}
              contentContainerStyle={{ gap: 3 }}
            />
          </>
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
  noMatches: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    color: "#888",
    fontWeight: "bold",
  },
});

export default HomeView;
