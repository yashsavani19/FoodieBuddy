import { StyleSheet, Image, Pressable, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useRoute} from '@react-navigation/native';
import { useLocalSearchParams, useRouter, Stack} from "expo-router";
import { RestaurantListItem } from "@/components/RestaurantListItem";
import index from "./index";
import { fetchRestaurantById } from "@/controller/FetchNearbyRestaurants";



export default function DetailsView() {
 

  const route = useRoute();
  const { id } = route.params as { id: string }; // Get the 'id' passed as parameter

  const restaurant = fetchRestaurantById(id);
  console.log((restaurant as any).name);


  if (!restaurant) {
    return (
      <View style={styles.centered}>
        <Text>{id} </Text>
        <Text>Nothing Found</Text>
      </View>

    ); // or handle the case when restaurant is not available
  }

  return (
    <View style={styles.container}>
      
      <Image source={{ uri: (restaurant as any).image }} style={styles.image} />
      <Text style={styles.title}>{(restaurant as any).name}</Text>
      <Text>ID: {(restaurant as any).id}</Text>
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
