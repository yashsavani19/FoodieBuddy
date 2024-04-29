import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import RestaurantListItem from "@/components/RestaurantListItem";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import TitleHeader from "@/components/TitleHeader";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import Loading from "../Loading";
import { Category } from '@/model/Category';

export default function HomeView() {
  const { searchFilterRestaurants, categoryFilterRestaurants, showNoRestaurantsFoundAlert, selectedCategory, searchTerm, setSelectedCategory, setSearchTerm, filteredRestaurants, dataLoading } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  // Handle filtering of restaurants based on search term and selected category
  useEffect(() => {
    setIsLoading(true);
    categoryFilterRestaurants();
    setIsLoading(false);
  }, [selectedCategory]);

  useEffect(() => {
    setIsLoading(true);
    searchFilterRestaurants();
    setIsLoading(false);
  }, [searchTerm]);

  useEffect(() => {
  
    showNoRestaurantsFoundAlert();
  }, [filteredRestaurants]);


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
        {isLoading || dataLoading ? (
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
