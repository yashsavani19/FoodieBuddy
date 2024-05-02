import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
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
const icons = "@/assets/data/images";

import {
  addBookmark,
  addFavourite,
  removeBookmark,
  removeFavourite,
  removeVisited,
} from "@/controller/DatabaseHandler";
import { Button } from "react-native-share";

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
const location_icon = require("@/assets/images/location_pin-icon.png");

interface DetailsViewComponentsProps {
  restaurant: Restaurant;
  backFunction: () => void;
}

const DetailsViewComponents: React.FC<DetailsViewComponentsProps> = ({
  restaurant,
  backFunction,
}) => {
  // Destructuring for ease of use
  const { name, image, displayAddress, rating, phone, website, distance } =
    restaurant;

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
            "Fave: " + item.restaurant.name + " " + visitedRestaurants
          );
          return;
        }
      }
      setFavePressed(false);
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

  return (
    <View style={styles.container}>
      <TitleHeader title="Details" />

      <View style={styles.contentContainer}>
        {/* Image Title Container */}
        <View style={styles.imageTitleIconContainer}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={backFunction}
          >
            <View>
              <Text style={styles.backButton}>{"<"} Back</Text>
            </View>
          </TouchableOpacity>
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
              <TouchableOpacity onPress={handleVisitedPress}>
                <Animated.Image
                  source={
                    isVisitedPressed ? visited_selected : visited_unselected
                  } // Assuming visited uses the same icon as fave
                  style={[
                    styles.smallIcon,
                    { transform: [{ scale: faveScale }] },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={handleFavouritePress}>
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
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleBookmarkPress}>
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
            </TouchableOpacity>
          </View>
        </View>

        {/* Restaurant Details */}
        <View style={styles.restaurantDetailsContainer}>
          {/* Restaurant Info */}
          <View style={styles.restaurantInfoContainer}>
            {rating && (
              <View style={styles.ratingContainer}>
                <Image source={star_icon} style={styles.smallIcon} />
                <Text style={styles.infoText}>{rating} / 5</Text>
              </View>
            )}

            {phone && (
              <View style={styles.phoneContainer}>
                <Image source={phone_icon} style={styles.smallIcon} />
                <Text style={styles.infoTextUnderlined}>{phone}</Text>
              </View>
            )}

            {website && (
              <View style={styles.websiteContainer}>
                <Image source={website_icon} style={styles.smallIcon} />
                <Text style={styles.infoTextUnderlined}>{website}</Text>
              </View>
            )}
          </View>

          {/* Map View */}
          <View style={styles.mapViewContainer}>
            <View style={styles.addressContainer}>
              <Image source={location_icon} style={styles.smallIcon} />
              <Text style={styles.infoText}>{displayAddress}</Text>
            </View>
            <View style={styles.distanceContainer}>
              <Image source={distance_icon} style={styles.smallIcon} />
              
              <Text style={styles.infoText}>{distance}</Text>
            </View>
            <TouchableOpacity
              onPress={handleMapViewPress}
              style={styles.findOnMapBtn}
            >
              <Text style={styles.mapLinkText}>Find on Map</Text>
            </TouchableOpacity>
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
    fontSize: 16,
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
    width: "50%",
    paddingRight: 15,
  },
  mapViewContainer: {
    marginLeft: 20,
    width: "50%",
    paddingRight: 20,
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
});

export default DetailsViewComponents;
