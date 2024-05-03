import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Linking,
  ScrollView,
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
import { formatDistance } from "@/app/Utils/FormatDistance";
import displayPriceLevel from "@/app/Utils/DisplayPriceLevel";
import MapView, { Marker } from "react-native-maps";
import MapViewStyle from "./../app/Utils/MapViewStyle.json";
import { AntDesign } from "@expo/vector-icons";

// Assume all images are imported correctly
const default_pic = require("@/assets/images/default_pic.png");
const fave_unselected = require("@/assets/images/fave-icon.png");
const fave_selected = require("@/assets/images/fave-Selected.png");
const bookmark_unselected = require("@/assets/images/bookmark-icon.png");
const bookmard_selected = require("@/assets/images/bookmark-Selected.png");
const visited_selected = require("@/assets/images/visited-Selected.png");
const visited_unselected = require("@/assets/images/visited-unselected-icon.png");
const star_icon = require("@/assets/images/star-icon.png");
const phone_icon = require("@/assets/images/phone-icon.png");
const website_icon = require("@/assets/images/web-icon.png");
const distance_icon = require("@/assets/images/walking_distance-icon.png");
const location_icon = require("@/assets/images/location.png");
const price_icon = require("@/assets/images/price-tag.png");

// Props interface for the component
interface DetailsViewComponentsProps {
  restaurant: Restaurant;
  backFunction: () => void;
}

const DetailsViewComponents: React.FC<DetailsViewComponentsProps> = ({
  restaurant,
  backFunction,
}) => {
  // Destructuring for ease of use
  const {
    name,
    image,
    displayAddress,
    rating,
    phone,
    website,
    distance,
    price,
  } = restaurant;

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
  const [isVisitedPressed, setVisitedPressed] = useState(false);
  const [isBookmarkPressed, setBookmarkPressed] = useState(false);
  const [isFavePressed, setFavePressed] = useState(false);
  const [isFindOnMapPressed, setFindOnMapPressed] = useState(false);

  const bookmarkScale = useState(new Animated.Value(1))[0];
  const faveScale = useState(new Animated.Value(1))[0];
  const visitedScale = useState(new Animated.Value(1))[0];

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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

  useEffect(() => {
    if (bookmarkedRestaurants) {
      for (let i = 0; i < bookmarkedRestaurants.length; i++) {
        const item = bookmarkedRestaurants[i];
        if (item.restaurant.id === restaurant.id) {
          setBookmarkPressed(true);
          console.log(
            "Bookmark: " + item.restaurant.name + " " + isBookmarkPressed
          );
          return;
        }
      }
      setBookmarkPressed(false);
    }
  }, [bookmarkedRestaurants]);

  useEffect(() => {
    if (favouriteRestaurants) {
      for (let i = 0; i < favouriteRestaurants.length; i++) {
        const item = favouriteRestaurants[i];
        if (item.restaurant.id === restaurant.id) {
          setFavePressed(true);
          console.log("Fave: " + item.restaurant.name + " " + isFavePressed);
          return;
        }
      }
      setFavePressed(false);
    }
  }, [favouriteRestaurants]);

  useEffect(() => {
    if (visitedRestaurants) {
      for (let i = 0; i < visitedRestaurants.length; i++) {
        const item = visitedRestaurants[i];
        if (item.restaurant.id === restaurant.id) {
          setVisitedPressed(true);
          console.log(
            "Visited: " + item.restaurant.name + " " + visitedRestaurants
          );
          return;
        }
      }
      setVisitedPressed(false);
    }
  }, [favouriteRestaurants]);

  // Function stubs for handling button presses (to be implemented)
  const handleFavouritePress = () => {
    console.log("Favourite pressed");
    if (isBookmarkPressed) {
      setBookmarkPressed(false);
      removeBookmarkContext(restaurant.id);
    }
    if (isFavePressed) {
      removeFavouriteContext(restaurant.id);
      setFavePressed(false);
    } else {
      addFavouriteContext(restaurant);
      setFavePressed(true);
    }
    animateIcon(faveScale);
  };

  // Function to handle the bookmark button press
  const handleBookmarkPress = () => {
    console.log("Bookmark pressed");
    if (isFavePressed) {
      setFavePressed(false);
      removeFavouriteContext(restaurant.id);
    }
    if (isBookmarkPressed) {
      removeBookmarkContext(restaurant.id);
      setBookmarkPressed(false);
    } else {
      addBookmarkContext(restaurant);
      setBookmarkPressed(true);
    }
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

  // Function stub for handling map view press
  const handleMapViewPress = () => {
    console.log("Map view pressed");
    setFindOnMapPressed(!isFindOnMapPressed);
    navigation.navigate("Map", { geometry: restaurant.geometry });
  };

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
      <TitleHeader title="Details" />

      <View style={styles.contentContainer}>
        {/* Image Title Container */}
        <View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.header}>
          <View style={styles.headerContent}>
            <AntDesign name="arrowleft" size={24} color="white" />
            <Text style={styles.title}>Back</Text>
          </View>
        </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.imageTitleIconContainer}>
            {/* <ScrollView style={{flex:1}}> */}
            <Text style={styles.restaurantTitle}>{name}</Text>
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
                <View style={styles.ratingContainer}>
                  <Image source={star_icon} style={styles.smallIcon} />
                  <Text style={styles.infoText}>
                    {rating ? `${rating} / 5` : `N/A`}
                  </Text>
                </View>

                <View style={styles.priceLevelContainer}>
                  <Image source={price_icon} style={styles.smallIcon} />
                  <Text style={styles.infoText}>
                    {price ? displayPriceLevel(parseInt(price)) : `N/A`}
                  </Text>
                </View>

                <View style={styles.phoneContainer}>
                  <Image source={phone_icon} style={styles.smallIcon} />
                  <Text
                    selectable={phone != undefined}
                    style={phone ? styles.infoTextUnderlined : styles.infoText}
                  >
                    {phone ? phone : `N/A`}
                  </Text>
                </View>

                <View style={styles.websiteContainer}>
                  <Image source={website_icon} style={styles.smallIcon} />
                  <Text
                    onPress={() => handleWebsitePress(restaurant.website)}
                    style={styles.infoTextUnderlined}
                  >
                    {website ? `Website` : `N/A`}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.rightContainer}>
              <View style={styles.addressContainer}>
                <Image source={location_icon} style={styles.smallIcon} />
                <Text selectable={true} style={styles.infoText}>
                  {displayAddress}
                </Text>
              </View>
              <View style={styles.distanceContainer}>
                <Image source={distance_icon} style={styles.smallIcon} />
                <Text style={styles.infoText}>{formatDistance(distance)}</Text>
              </View>
            </View>
          </View>
          {/* Map View */}
          {/* <View style={styles.mapViewContainer}> */}
          {/* Wrap MapView inside a View */}
          <View style={styles.mapContainer}>
            <View style={styles.findOnMapBtnView}>
              <TouchableOpacity
                onPress={handleMapViewPress}
                style={styles.findOnMapBtn}
              >
                <Text style={styles.mapLinkText}>Find on Map</Text>
              </TouchableOpacity>
            </View>
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
            {/* </View> */}
          </View>
        </ScrollView>
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    height: "auto",
    paddingBottom: 42,
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
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  contentContainer: {
    // position: "absolute",
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
    width: "50%",
    paddingRight: 15,
  },
  restaurantImage: {
    width: "100%",
    height: 200, // Set a fixed height or make it responsive as needed
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
    // fontSize: 16,
    // color: "#0066CC",
    backgroundColor: "#0066CC",
    color: "white",
    padding: "2%",
    paddingHorizontal: "5%",
    borderRadius: 5,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
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
    marginVertical: 4,
    flexDirection: "row",
  },
  priceLevelContainer: {
    marginVertical: 4,
    flexDirection: "row",
  },
  distanceContainer: {
    marginVertical: 4,
    flexDirection: "row",
  },
  phoneContainer: {
    marginVertical: 4,
    flexDirection: "row",
  },
  addressContainer: {
    marginVertical: 4,
    flexDirection: "row",
  },
  findOnMapBtn: {
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  findOnMapBtnView: {
    bottom: 10,
    right: 10,
    position: "absolute",
    //alignSelf: "flex-end",
    zIndex: 1,
  },
  leftContainer: {
    flex: 1,
    paddingRight: 10,
  },
  rightContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 8,
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
    height: 300,
    marginHorizontal: 15,
    marginBottom: 20,
    // width: '100%',
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1, // added for title alignment
    textAlign: "center", // align the title
    color: 'white'
  },
});

export default DetailsViewComponents;
