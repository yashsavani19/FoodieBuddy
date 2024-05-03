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

const FavouriteSpotsView: React.FC = () => {
  const { favouriteRestaurants } = useContext(AppContext);
  const favouriteList = favouriteRestaurants.map((item) => item.restaurant);
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: Saved }) => (
    <SavedListItem item={item} listType="favourite" />
  );

  // useEffect(() => {
  //   favouriteList = favouriteRestaurants.map((item) => item.restaurant);
  // } , [favouriteRestaurants]);

  return (
    <View style={styles.container}>
      <TitleHeader title="Favorites"/>
      <View style={styles.content}>
        {/* Back Button and Title */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.header}>
          <View style={styles.headerContent}>
            <AntDesign name="arrowleft" size={24} color="white" />
            <Text style={styles.title}>Back</Text>
          </View>
        </TouchableOpacity>
        {/* List of Favourite Restaurants */}
        {favouriteRestaurants.length === 0 && (
          <View style={styles.noRestaurants}>
            <Text style={styles.titleText}>No favourite spots</Text>
          </View>
        )}
        <View style={styles.listContainer}>
          <FlatList
            data={favouriteRestaurants}
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
    height: 40, // Adjust the height
    backgroundColor: "black", // Change background color
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerContent: {
    height: 40, // Adjust the height
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10, // Add padding for spacing
  },
  backButton: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1, // added for title alignment
    textAlign: "center", // align the title
    color: 'white'
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

