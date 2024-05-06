import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "@/context/AppContext";
import SavedListItem from "@/components/SavedListItem";
import { Saved } from "@/model/Saved";
import TitleHeader from "@/components/TitleHeader";

// BookmarkedSpotsView component
const BookmarkedSpotsView: React.FC = () => {
  const { bookmarkedRestaurants } = useContext(AppContext);
  const navigation = useNavigation();
  const renderItem = ({ item }: { item: Saved }) => (
    <SavedListItem item={item} listType="bookmarked" />
  );

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <TitleHeader title="Bookmark" /> {/* Display title header */}
      <View style={styles.content}>
        {/* Back Button and Title */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <AntDesign name="arrowleft" size={24} color="white" />
            <Text style={styles.title}>Back</Text>
          </View>
        </TouchableOpacity>

        {/* Display message if no restaurants bookmarked */}
        {bookmarkedRestaurants.length === 0 && (
          <View style={styles.noRestaurants}>
            <Text style={styles.titleText}>No Bookmarked spots</Text>
          </View>
        )}
        {/* FlatList to display bookmarked restaurants */}
        <View style={styles.listContainer}>
          <FlatList
            data={bookmarkedRestaurants}
            keyExtractor={(item) => item.restaurant.id.toString()}
            renderItem={renderItem}
          />
        </View>
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
