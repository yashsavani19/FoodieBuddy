import { StyleSheet, Image, Pressable, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { RestaurantListItem } from "@/components/RestaurantListItem";
import index from "./index";
import { Restaurant } from "@/model/Restaurant";
import { RootStackParamList } from '@/constants/navigationTypes';
import { RouteProp } from '@react-navigation/native';

type DetailsViewRouteProp = RouteProp<RootStackParamList, 'DetailsView'>;

export default function DetailsView() {
  // Retrieve the route object
  const route = useRoute<DetailsViewRouteProp>();
  // Extract the restaurant object from route.params
  const { Restaurant } = route.params;
  alert(Restaurant.name);

  // Use the restaurant object directly in your JSX
  if (!Restaurant) {
    return (
      <View style={styles.centered}>
        <Text> Something Restaurant not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{Restaurant.name}</Text>
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
