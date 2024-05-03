import { Restaurant } from "@/model/Restaurant";
import { StyleSheet, Image, Pressable, Animated } from "react-native";
import { Text, View } from "./Themed";
import images from "@/assets/data/images";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
import StarRating from "./StarRating";
import { formatDistance } from "@/app/Utils/FormatDistance";
import { AppContext } from "@/context/AppContext";
type RestaurantListItemProps = {
  restaurant: Restaurant;
};
export const RestaurantListItem = ({ restaurant }: RestaurantListItemProps) => {
  // Retrieve context for user-related data
  const { visitedRestaurants } = useContext(AppContext);
  // State variable for determining if restaurant is visited
  const [isVisited, setIsVisited] = useState(false);
  // Check if the restaurant is in visited list when component mounts
  useEffect(() => {
    if (visitedRestaurants) {
      for (let i = 0; i < visitedRestaurants.length; i++) {
        const item = visitedRestaurants[i];
        if (item.restaurant.id === restaurant.id) {
          setIsVisited(true);
          return;
        }
      }
      setIsVisited(false);
    }
  }, [visitedRestaurants]);

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
  // Check if the restaurant is bookmarked when component mounts
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
  // Check if the restaurant is marked as favorite when component mounts
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
  // Function to display price level as a string of '$' symbols
  function displayPriceLevel(priceLevel: number): string {
    let price = "";
    for (let i = 0; i < priceLevel; i++) {
      price += "$";
    }
    return price;
  }
  // Function to handle the favorite button press
  const handleFavouritePressed = () => {
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
  const handleBookmarkPressed = () => {
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
      style={styles.container}
      onPress={() => {
        // Navigate to DetailsView screen
        navigation.navigate("DetailsView", { Restaurant: restaurant });
      }}
    >
      {/* Restaurant image */}
      <Image
        testID="restaurant-image"
        source={{ uri: restaurant.image || images.defaultRestaurantImage }}
        style={styles.image}
        resizeMode="cover"
      />
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontWeight: "bold" }}>
              Rating:{" "}
              {restaurant.rating !== undefined ? (
                <StarRating rating={restaurant.rating} />
              ) : (
                "N/A"
              )}
            </Text>
            <Text style={styles.distance}>
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
              source={{
                uri: isBookmarkPressed
                  ? images.bookmarkSelectedIcon
                  : images.bookmarkIcon,
              }}
              style={[styles.icon, { transform: [{ scale: bookmarkScale }] }]}
            />
          </Pressable>
        </View>
        {/* Favourite button */}
        <View style={styles.iconContainer}>
          <Pressable onPress={handleFavouritePressed}>
            <Animated.Image
              source={{
                uri: isFavePressed ? images.faveSelectedIcon : images.faveIcon,
              }}
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
    //borderRadius: 10,
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
  },
  findOnMap: {
    fontWeight: "bold",
    textAlignVertical: "center",
    width: 50,
    marginRight: 8,
    textAlign: "left",
  },
  image: {
    width: "100%",
    aspectRatio: 2.5 / 1,
    borderRadius: 10,
  },
  icon: {
    width: 27,
    aspectRatio: 1,
    resizeMode: "contain",
    marginLeft: 2,
  },
  mapIcon: {
    width: 32,
    aspectRatio: 1,
    resizeMode: "contain",
  },
});
