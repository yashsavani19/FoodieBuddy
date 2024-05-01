import React, { useContext, useEffect } from "react";
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
import { Restaurant } from "@/model/Restaurant";
import SavedListItem from "@/components/SavedListItem";
import { Saved } from "@/model/Saved";

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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Favorite Eating Spots</Text>
      </View>
      <FlatList
        data={favouriteRestaurants}
        keyExtractor={(item) => item.restaurant.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
});

export default FavouriteSpotsView;
