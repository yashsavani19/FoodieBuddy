import { Restaurant } from "@/model/Restaurant";
import { StyleSheet, Image, Pressable, Animated } from "react-native";
import { Text, View } from "./Themed";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
import StarRating from "./StarRating";
import { formatDistance } from "@/app/Utils/FormatDistance";
import { AppContext } from "@/context/AppContext";
import { OpenStatusLabelList } from "./OpenIndicatorComponents/OpenStatusLabel";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

type RestaurantListItemProps = {
  restaurant: Restaurant;
  isLastItem: boolean;
};

// Local images
const fave_icon = require("@/assets/images/fave-icon.png");
const fave_Selected_icon = require("@/assets/images/fave-Selected.png");
const bookmark_icon = require("@/assets/images/bookmark-icon.png");
const bookmark_Selected_icon = require("@/assets/images/bookmark-Selected.png");
const default_restaurant_picture = require("@/assets/images/default_pic.png");

/**
 * Restaurant list item component that displays restaurant information in Home list
 * @param param0 - restaurant object
 * @returns - Restaurant list item component
 */
export const RestaurantListItem = ({ restaurant, isLastItem }: RestaurantListItemProps) => {
  // Retrieve context for user-related data
  const { visitedRestaurants } = useContext(AppContext);

  // State variable for determining if restaurant is visited
  const [isVisited, setIsVisited] = useState(false);

  // Retrieve context for user-related data
  const {
    favouriteRestaurants,
    bookmarkedRestaurants,
    addBookmarkContext,
    removeBookmarkContext,
    addFavouriteContext,
    removeFavouriteContext,
  } = useContext(AppContext);

  // State variables for button presses
  const [isBookmarkPressed, setBookmarkPressed] = useState(false);
  const [isFavePressed, setFavePressed] = useState(false);
  const [isFindOnMapPressed, setFindOnMapPressed] = useState(false);

  // Navigation hook for navigating to other screens
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Animation variables for button presses
  const bookmarkScale = useState(new Animated.Value(1))[0];
  const faveScale = useState(new Animated.Value(1))[0];

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

  // Check if the restaurant is in visited list 
  useEffect(() => {
    setIsVisited(visitedRestaurants?.some(item => item.restaurant.id === restaurant.id) || false);
  }, [visitedRestaurants]);

  // Check if the restaurant is bookmarked 
  useEffect(() => {
    setBookmarkPressed(bookmarkedRestaurants?.some(item => item.restaurant.id === restaurant.id) || false);
  }, [bookmarkedRestaurants]);

  // Check if the restaurant is marked as favorite 
  useEffect(() => {
    setFavePressed(favouriteRestaurants?.some(item => item.restaurant.id === restaurant.id) || false);
  }, [favouriteRestaurants]);

  // Function to display price level as a string of '$' symbols
  function displayPriceLevel(priceLevel: number): string {
    let price = "";
    for (let i = 0; i < priceLevel; i++) {
      price += "$";
    }
    return price;
  }
  
  const handleFavouritePressed = () => {
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

  const handleBookmarkPressed = () => {
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

  return (
    <Pressable
      testID={isLastItem ? "last-restaurant-list-item" : "restaurant-list-item"}
      style={styles.container}
      onPress={() => {
        // Navigate to DetailsView screen
        navigation.navigate("DetailsView", { Restaurant: restaurant });
      }}
    >
      {/* Restaurant image */}
      <Image 
        testID="restaurant-image"
        source={restaurant.image ? {uri : restaurant.image} : default_restaurant_picture}
        style={styles.image}
        resizeMode="cover"
      />
      {/* Open status label */}
      <OpenStatusLabelList restaurant={restaurant} />
      <View style={styles.textContainer}>
        {/* Find on map button */}
        <Pressable
          onPress={() => {
            setFindOnMapPressed(!isFindOnMapPressed);
            navigation.navigate("Map", { geometry: restaurant.geometry });
            console.log("Find on map pressed");
          }}
        >
          <View style={styles.iconContainer}>
            <Image
              source={
                isVisited
                  ? require("../assets/images/location-check.png")
                  : require("../assets/images/location.png")
              }
              style={styles.mapIcon}
            />
            <Text style={styles.findOnMap}>Find on map</Text>
          </View>
          {/* Restaurant information */}
        </Pressable>
          <View style={styles.textInfo}>
            <Text style={styles.title}>{restaurant.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1, flexWrap: "wrap" }}>
              <Text style={{ fontWeight: "bold" }}>
                {<StarRating rating={restaurant.rating} />}
              </Text>
              <Text style={styles.distance} testID="Restaurant Distance">
                {formatDistance(restaurant.distance)}
              </Text>
              <Text style={styles.distance}>
                {restaurant.price !== undefined
                  ? displayPriceLevel(parseInt(restaurant.price))
                  : ""}
              </Text>
            </View>
          </View>
          {/* Bookmark button */}
          <View style={styles.iconContainer}>
            <Pressable onPress={handleBookmarkPressed}>
              <Animated.Image
                source={ isBookmarkPressed ? bookmark_Selected_icon : bookmark_icon }
                style={[styles.icon, { transform: [{ scale: bookmarkScale }] }]}
              />
            </Pressable>
          </View>
          {/* Favourite button */}
          <View style={styles.iconContainer}>
            <Pressable onPress={handleFavouritePressed}>
              <Animated.Image
                source={ isFavePressed ? fave_Selected_icon : fave_icon }
                style={[styles.icon, { transform: [{ scale: faveScale }] }]}
              />
            </Pressable>
          </View>
        </View>
    </Pressable>
  );
};
export default RestaurantListItem;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingRight: 4,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
    flexWrap: "wrap",
  },
  distance: {
    fontWeight: "bold",
    textAlign: "left",
    paddingLeft: 10,
    flexWrap: "wrap",
  },
  findOnMap: {
    fontWeight: "bold",
    textAlignVertical: "center",
    width: 50,
    marginRight: 8,
    textAlign: "left",
  },
  image: {
    width: wp('100%'),
    height: wp('38%'),
    aspectRatio: 2.5 / 1,
    borderRadius: 10,
  },
  icon: {
    width: wp('8%'),
    height: wp('8%'),
    resizeMode: "contain",
    marginLeft: 2,
  },
  mapIcon: {
    width: 32,
    aspectRatio: 1,
    resizeMode: "contain",
  },
});
