import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Linking,
} from "react-native";
import { Restaurant } from "@/model/Restaurant";
import TitleHeader from "@/components/TitleHeader";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
import { Animated } from "react-native";
import images from "@/assets/data/images";
import { AppContext } from "@/context/AppContext";
import MapView, { Marker } from "react-native-maps";
import MapViewStyle from "./../app/Utils/MapViewStyle.json";
import { AntDesign } from "@expo/vector-icons";

// Importing the required images
const default_pic = require("@/assets/images/default_pic.png");
const visited_selected = require("@/assets/images/visited-Selected.png");
const visited_unselected = require("@/assets/images/visited-unselected-icon.png");
const star_icon = require("@/assets/images/star-icon.png");
const phone_icon = require("@/assets/images/phone-icon.png");
const website_icon = require("@/assets/images/web-icon.png");
const distance_icon = require("@/assets/images/walking_distance-icon.png");
const location_icon = require("@/assets/images/location_pin-icon.png");

// Props interface for the component
interface DetailsViewComponentsProps {
  restaurant: Restaurant;
  backFunction: () => void;
}
// Component definition for displaying restaurant details and handling interactions
const DetailsViewComponents: React.FC<DetailsViewComponentsProps> = ({
  restaurant,
  backFunction,
}) => {
  // Destructuring for ease of use
  const { name, image, displayAddress, rating, phone, website, distance } =
    restaurant;
  // Accessing context and state variables
  const {
    favouriteRestaurants,
    bookmarkedRestaurants,
    visitedRestaurants,
    addBookmarkContext,
    removeBookmarkContext,
    addFavouriteContext,
    removeFavouriteContext,
    removeVisitedContext,
    addVisitedContext,
  } = useContext(AppContext);
  // State variables for button presses
  const [isVisitedPressed, setVisitedPressed] = useState(false);
  const [isBookmarkPressed, setBookmarkPressed] = useState(false);
  const [isFavePressed, setFavePressed] = useState(false);
  const [isFindOnMapPressed, setFindOnMapPressed] = useState(false);
  // Animated values for scaling buttons
  const bookmarkScale = useState(new Animated.Value(1))[0];
  const faveScale = useState(new Animated.Value(1))[0];
  const visitedScale = useState(new Animated.Value(1))[0];
  // Navigation hook to access navigation functionalities provided by React Navigation
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // Function to animate button press
  const animateIcon = (scale: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 70,
        useNativeDriver: true,
      }),
    ]).start();
  };
  // Effect hook to update the state based on changes in the bookmarked restaurants context
  useEffect(() => {
    // Check if there are bookmarked restaurants
    if (bookmarkedRestaurants) {
      // Loop through each bookmarked restaurant
      for (let i = 0; i < bookmarkedRestaurants.length; i++) {
        const item = bookmarkedRestaurants[i];
        // Check if the current restaurant is bookmarked
        if (item.restaurant.id === restaurant.id) {
          // If bookmarked, set the bookmark state to true
          setBookmarkPressed(true);
          // Log the bookmark status to the console
          console.log(
            "Bookmark: " + item.restaurant.name + " " + isBookmarkPressed
          );
          // Exit the loop since the restaurant is found
          return;
        }
      }
      // If the loop completes without finding the restaurant, set the bookmark state to false
      setBookmarkPressed(false);
    }
  }, [bookmarkedRestaurants]);
  // Effect hook to update the state based on changes in the list of favorite restaurants
  useEffect(() => {
    if (favouriteRestaurants) {
      // Iterate through the list of favorite restaurants
      for (let i = 0; i < favouriteRestaurants.length; i++) {
        const item = favouriteRestaurants[i];
        // Check if the current restaurant in the list matches the displayed restaurant
        if (item.restaurant.id === restaurant.id) {
          // If the restaurant is found in the favorites, set the state to true
          setFavePressed(true);
          // Log a message indicating the restaurant is a favorite and its name
          console.log("Fave: " + item.restaurant.name + " " + isFavePressed);
          return; // Exit the loop since the restaurant is found
        }
      }
      // If the loop completes without finding a match, set the state to false
      setFavePressed(false);
    }
  }, [favouriteRestaurants]);
  // Effect hook to update the state based on changes in the list of visited restaurants
  useEffect(() => {
    if (visitedRestaurants) {
      // Iterate through the list of visited restaurants
      for (let i = 0; i < visitedRestaurants.length; i++) {
        const item = visitedRestaurants[i];
        // Check if the current restaurant in the list matches the displayed restaurant
        if (item.restaurant.id === restaurant.id) {
          // If the restaurant is found in the visited list, set the state to true
          setVisitedPressed(true);
          // Log a message indicating the restaurant is visited along with its name
          console.log(
            "Visited: " + item.restaurant.name + " " + visitedRestaurants
          );
          return; // Exit the loop since the restaurant is found
        }
      }
      // If the loop completes without finding a match, set the state to false
      setVisitedPressed(false);
    }
  }, [visitedRestaurants]);
  // Function stubs for handling button presses (to be implemented)
  const handleFavouritePress = () => {
    console.log("Favourite pressed");
    // If bookmark is already pressed, reset it and remove bookmark
    if (isBookmarkPressed) {
      setBookmarkPressed(false);
      removeBookmarkContext(restaurant.id);
    }
    // Toggle the favourite state
    if (isFavePressed) {
      removeFavouriteContext(restaurant.id);
      setFavePressed(false);
    } else {
      addFavouriteContext(restaurant);
      setFavePressed(true);
    }
    // Animate the favourite icon
    animateIcon(faveScale);
  };
  // Function to handle the press event of the bookmark button
  const handleBookmarkPress = () => {
    console.log("Bookmark pressed");
    // If favourite is already pressed, reset it and remove favourite
    if (isFavePressed) {
      setFavePressed(false);
      removeFavouriteContext(restaurant.id);
    }
    // Toggle the bookmark state
    if (isBookmarkPressed) {
      removeBookmarkContext(restaurant.id);
      setBookmarkPressed(false);
    } else {
      addBookmarkContext(restaurant);
      setBookmarkPressed(true);
    }
    // Animate the bookmark icon
    animateIcon(bookmarkScale);
  };
  const handleVisitedPress = () => {
    console.log("Visited pressed");
    if (isVisitedPressed) {
      removeVisitedContext(restaurant.id);
      setVisitedPressed(false);
    } else {
      addVisitedContext(restaurant);
      setVisitedPressed(true);
    }
    animateIcon(visitedScale);
  };
  // Function to handle the press event of the map view button
  const handleMapViewPress = () => {
    console.log("Map view pressed");
    // Toggle the state for finding on the map
    setFindOnMapPressed(!isFindOnMapPressed);
    // Navigate to the Map screen with the restaurant's geometry data
    navigation.navigate("Map", { geometry: restaurant.geometry });
  };
  // Function to handle the press event of the website link
  const handleWebsitePress = (websiteUrl: string) => {
    if (websiteUrl) {
      // Open the restaurant's website in the device's browser
      Linking.openURL(websiteUrl);
      // Log a message to the console
      console.log(`Opening website: ${websiteUrl}`);
    } else {
      console.log("No website URL provided.");
    }
  };
  return (
    <View style={styles.container}>
      {/* Title Header */}
      <TitleHeader title="Details" />
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Image Title Container */}
        <View style={styles.imageTitleIconContainer}>
          {/* Back Button */}
          {/* Back Button and Title */}
       <TouchableOpacity  onPress={backFunction} style={styles.header}>
          <View style={styles.headerContent}>
            <AntDesign name="arrowleft" size={24} color="white" />
            <Text style={styles.title}>Back</Text>
          </View>
        </TouchableOpacity>

          {/* Restaurant Title */}
          <Text style={styles.restaurantTitle}>{name}</Text>
          {/* Restaurant Image */}
          <View style={styles.imageContainer}>
            <Image
              source={image ? { uri: image } : default_pic}
              style={styles.restaurantImage}
            />
          </View>
          {/* Interaction Buttons */}
          <View style={styles.interactionContainer}>
            {/* Visited Button */}
            <View style={styles.iconContainer}>
              <Pressable onPress={handleVisitedPress}>
                <Animated.Image
                  source={
                    isVisitedPressed ? visited_selected : visited_unselected
                  } // Assuming visited uses the same icon as fave
                  style={[
                    styles.smallIcon,
                    { transform: [{ scale: visitedScale }] },
                  ]}
                />
              </Pressable>
            </View>
            {/* Favourite Button */}
            <View style={styles.iconContainer}>
              <Pressable onPress={handleFavouritePress}>
                <Animated.Image
                  source={{
                    uri: isFavePressed
                      ? images.faveSelectedIcon
                      : images.faveIcon,
                  }}
                  style={[
                    styles.smallIcon,
                    { transform: [{ scale: faveScale }] },
                  ]}
                />
              </Pressable>
            </View>
            {/* Favourite Button */}
            <Pressable onPress={handleBookmarkPress}>
              <Animated.Image
                source={{
                  uri: isBookmarkPressed
                    ? images.bookmarkSelectedIcon
                    : images.bookmarkIcon,
                }}
                style={[
                  styles.smallIcon,
                  { transform: [{ scale: bookmarkScale }] },
                ]}
              />
            </Pressable>
          </View>
        </View>
        {/* Restaurant Details */}
        <View style={styles.restaurantDetailsContainer}>
          {/* Left Container */}
          <View style={styles.leftContainer}>
            {/* Restaurant Info */}
            <View style={styles.restaurantInfoContainer}>
              {/* Rating */}
              {rating && (
                <View style={styles.ratingContainer}>
                  <Image source={star_icon} style={styles.smallIcon} />
                  <Text style={styles.infoText}>{rating} / 5</Text>
                </View>
              )}
              {/* Phone */}
              {phone && (
                <View style={styles.phoneContainer}>
                  <Image source={phone_icon} style={styles.smallIcon} />
                  <Text style={styles.infoTextUnderlined}>{phone}</Text>
                </View>
              )}
              {/* Website */}
              {website && (
                <View style={styles.websiteContainer}>
                  <Image source={website_icon} style={styles.smallIcon} />
                  <Text
                    onPress={() => handleWebsitePress(restaurant.website)}
                    style={styles.infoTextUnderlined}
                  >
                    Website link
                  </Text>
                </View>
              )}
            </View>
            {/* Address */}
            <View style={styles.addressContainer}>
              <Image source={location_icon} style={styles.smallIcon} />
              <Text style={styles.infoText}>{displayAddress}</Text>
            </View>
            {/* Distance */}
            <View style={styles.distanceContainer}>
              <Image source={distance_icon} style={styles.smallIcon} />
              <Text style={styles.infoText}>{distance} km</Text>
            </View>
            {/* Find on Map Button */}
            <TouchableOpacity
              onPress={handleMapViewPress}
              style={styles.findOnMapBtn}
            >
              <Text style={styles.mapLinkText}>Find on Map</Text>
            </TouchableOpacity>
          </View>
          {/* Right Container (MapView) */}
          <View style={styles.rightContainer}>
            {/* Wrap MapView inside a View */}
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                customMapStyle={MapViewStyle}
                // Set initial region using restaurant's latitude and longitude
                initialRegion={{
                  latitude: restaurant.geometry.location.lat,
                  longitude: restaurant.geometry.location.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                {/* Add a marker to indicate the restaurant's location */}
                <Marker
                  coordinate={{
                    latitude: restaurant.geometry.location.lat,
                    longitude: restaurant.geometry.location.lng,
                  }}
                  title={restaurant.name}
                />
              </MapView>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    height: "auto",
  },
  backButtonContainer: {
    width: "100%",
    height: "auto",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#363232",
    fontSize: 20,
  },
  backButton: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  contentContainer: {
    position: "absolute",
    width: "100%",
    marginTop: 120,
  },
  restaurantTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    marginTop: 8,
    textAlign: "center",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
    height: "100%",
  },
  smallIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginLeft: 2,
  },
  imageTitleIconContainer: {
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "90%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  interactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  restaurantDetailsContainer: {
    flexDirection: "row",
    width: "100%",
    padding: 20,
  },
  restaurantInfoContainer: {
    width: "100%",
    paddingRight: 15,
  },
  restaurantImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 8,
  },
  addressRating: {
    fontSize: 16,
    color: "#333",
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  mapLinkText: {
    fontSize: 16,
    color: "#0066CC",
  },
  phoneWebsite: {
    fontSize: 16,
    color: "#333",
    marginVertical: 4,
  },
  restaurantDistance: {
    fontSize: 16,
    color: "#333",
    marginVertical: 4,
  },
  infoText: {
    fontSize: 14,
    color: "black",
    marginLeft: 6,
    textAlign: "left",
  },
  infoTextUnderlined: {
    fontSize: 14,
    color: "black",
    marginLeft: 6,
    textAlign: "left",
    textDecorationLine: "underline",
  },
  websiteContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  distanceContainer: {
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  phoneContainer: {
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  addressContainer: {
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  findOnMapBtn: {
    marginVertical: 5,
  },
  leftContainer: {
    flex: 1,
    paddingRight: 10,
  },
  rightContainer: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: "white",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    height: 200,
  },
  header: {
    height: 40, // Adjust the height
    width: "100%", // Set width to 100% to fill the entire screen width
    backgroundColor: "black",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerContent: {
    height: 40, // Adjust the height
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    width: "100%", // Set width to 100% to fill the entire screen width
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1, // added for title alignment
    textAlign: "center", // align the title
    color: 'white'
  },
});
export default DetailsViewComponents;
