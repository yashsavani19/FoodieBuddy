import {
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Text, View
} from "react-native";
import { useState, useEffect } from "react";
import EditScreenInfo from "@/components/EditScreenInfo";

import { useRoute } from "@react-navigation/native";
import TitleHeader from "@/components/TitleHeader";
import { RootStackParamList } from "@/constants/navigationTypes";
import { RouteProp } from "@react-navigation/native";
import { Restaurant } from "@/model/Restaurant";
import DetailsViewComponents from "@/components/DetailsViewComponents";
import { useNavigation } from "expo-router";

type DetailsViewRouteProp = RouteProp<RootStackParamList, "DetailsView">;


export default function DetailsView() {
  const navigation = useNavigation();
  function backFunction() {
    // Add code to go back in navigation
    
    navigation.goBack();
  }

  
  // Retrieve the route object
  const route = useRoute<DetailsViewRouteProp>();
  // Extract the restaurant object from route.params
  const { Restaurant } = route.params;

  //----------------------TEMPORARY CODE------------------------
  //create another dummy restaurant object, with all its values
  const dummyRestaurant: Restaurant = {
    website: "http://www.sensationalchicken.com",
    geometry: {
      location: {
        lat: 36.7783,
        lng: -119.4179,
      },
    },
    id: "res12345",
    name: "Sensational Chicken",
    image:
      "https://lh5.googleusercontent.com/p/AF1QipMR-rQ2Ghjs0kQusZH3MCcorrRvbosQOAn5GRy-=w408-h306-k-no",
    categories: ["Fast Food", "Chicken", "Dine-In"],
    price: "$$",
    rating: 4.2,
    displayAddress: "123 Main Street, Anytown, CA 90210",
    phone: "(123) 456-7890",
    distance: "0.5 km",
    isClosed: "No",
    isFavourite: true,
    isBookmarked: false,
    isVisited: true,
  };
  //----------------------TEMPORARY CODE------------------------

  // Use the restaurant object directly in your JSX
  if (!Restaurant) {
    return (
      <View style={styles.centered}>
        <Text> Something Restaurant not found.</Text>
      </View>
    );
  }

  return (
      <DetailsViewComponents restaurant={Restaurant} backFunction={backFunction} />

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: "relative",
    // alignItems: "center",
    // justifyContent: "center",
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
  backButtonContainer: {
    // width: "100%",
    // height: "auto",
    // alignItems: "center",
    // backgroundColor: "#363232",
    // fontSize: 20,
  },
  backButton: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
