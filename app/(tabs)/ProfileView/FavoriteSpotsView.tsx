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
import BackButton from "@/components/BackButton";

const FavouriteSpotsView: React.FC = () => {

  // Get favourite restaurants from context
  const { favouriteRestaurants } = useContext(AppContext);

  // Get navigation object
  const navigation = useNavigation(); 

  // Render each saved item
  const renderItem = ({ item }: { item: Saved }) => (
    <SavedListItem item={item} listType="favourite" /> 
  );

  return (
    <View style={styles.container}>
      {/* Display title header */}
      <TitleHeader title="Favorites"/>
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

