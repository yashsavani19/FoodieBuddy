import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import SavedListItem from "@/components/SavedListItem";
import { Saved } from "@/model/Saved";
import TitleHeader from "@/components/TitleHeader";
import BackButton from "@/components/BackButton";
import { RootStackParamList } from "@/constants/navigationTypes";
import SavedList from "@/components/SavedLists/SavedList";
import Constants from "expo-constants";

type FavouriteSpotsRouteProp = RouteProp<
  RootStackParamList,
  "FavoriteSpotsView"
>;

const FavouriteSpotsView: React.FC = () => {
  const route = useRoute<FavouriteSpotsRouteProp>();
  const { favouriteRestaurants } = route.params;

  return (
    <View style={styles.container}>
      {/* Display title header */}
      <TitleHeader title="Favorites" />
      <View style={styles.content}>
        {/* Back Button and Title */}
        <BackButton />
        {/* Display message if no favourite restaurants */}
        {favouriteRestaurants.length === 0 && (
          <View style={styles.noRestaurants}>
            <Text style={styles.titleText}>No favourite spots</Text>
          </View>
        )}
        {/* FlatList to display favourite restaurants */}
        <SavedList restaurants={favouriteRestaurants} type="favourite" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    marginTop: Constants.statusBarHeight + 100,
  },
  header: {
    height: 40,
    backgroundColor: "black",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerContent: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  backButton: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "white",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  spotName: {
    fontSize: 18,
  },
  noRestaurants: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    color: "#888",
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
  },
});

export default FavouriteSpotsView;
