import { StyleSheet, Image, Pressable, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { RestaurantListItem } from "@/components/RestaurantListItem";
import index from "./index";
import { Restaurant } from "@/model/Restaurant";
// import { fetchRestaurantById } from "@/controller/FetchNearbyRestaurants";

export default function DetailsView() {
  const route = useRoute();
  // const Restaurant = route.params as { restaurant: Restaurant }; // Get the 'id' passed as parameter
  // const RestaurantInfo = Restaurant.restaurant;
  // const restaurant = fetchRestaurantById(id);
  // console.log((restaurant as any).name);

  // console.log(Restaurant.restaurant.id);
  // if (!RestaurantInfo) {
  //   return (
  //     <View style={styles.centered}>
  //       <Text>Nothing Found</Text>
  //     </View>
  //   ); // or handle the case when restaurant is not available
  // }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>{Restaurant.restaurant.name}</Text>
      <Text>ID: {Restaurant.restaurant.id}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
});
