import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TitleHeader from "@/components/TitleHeader";
import BackButton from "@/components/BackButton";
import SavedList from "@/components/SavedLists/SavedList";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";

type BookmarkedSpotsRouteProp = RouteProp<
  RootStackParamList,
  "BookmarkedSpotsView"
>;

// BookmarkedSpotsView component
const BookmarkedSpotsView: React.FC = () => {
  const route = useRoute<BookmarkedSpotsRouteProp>();
  const { bookmarkedRestaurants } = route.params;

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <TitleHeader title="Bookmarks" />
      <View style={styles.content}>
        <BackButton />
        {!bookmarkedRestaurants ||
          (bookmarkedRestaurants.length === 0 && (
            <View style={styles.noRestaurants}>
              <Text style={styles.titleText}>No Bookmarked spots</Text>
            </View>
          ))}
        <SavedList restaurants={bookmarkedRestaurants} type="bookmarked" />
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
    marginTop: 120,
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

export default BookmarkedSpotsView;
