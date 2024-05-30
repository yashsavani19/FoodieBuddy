import * as React from 'react';
import { FC, useContext, useEffect } from "react";
import DrawerWrapper from '@/components/FilterDrawerComponents/FilterDrawerWrapper'; 
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RestaurantListItem from "@/components/RestaurantListItem";
import { AppContext } from "@/context/AppContext";
import Colors from "@/constants/Colors";
import TitleHeader from "@/components/TitleHeader";
import Constants from "expo-constants";

const HomeView: FC = () => {
  const { 
    searchTerm, setSearchTerm,
    filteredRestaurants, 
    dataLoading, 
    restaurantListIsLoading,
  } = useContext(AppContext);

  return (
    <DrawerWrapper>
      <View style={{ flex: 1 }}>
        <TitleHeader
          searchBar={true} 
          onSearchSubmit={setSearchTerm}
          searchTerm={searchTerm}
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
    </DrawerWrapper>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    marginTop: Constants.statusBarHeight + 100,
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
