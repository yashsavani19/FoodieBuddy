import { Restaurant } from "@/model/Restaurant";
import { StyleSheet, Image, Pressable, Animated } from "react-native";
import { Text, View } from "./Themed";
import images from "@/assets/data/images";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
import StarRating from "./StarRating";

type RestaurantListItemProps = {
  restaurant: Restaurant;
};

export const RestaurantListItem = ({ restaurant }: RestaurantListItemProps) => {
  const [isBookmarkPressed, setBookmarkPressed] = useState(false);
  const [isFavePressed, setFavePressed] = useState(false);
  const [isFindOnMapPressed, setFindOnMapPressed] = useState(false);

  //const navigation = useNavigation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const bookmarkScale = useState(new Animated.Value(1))[0];
  const faveScale = useState(new Animated.Value(1))[0];

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

  function displayPriceLevel(priceLevel: number): string {
    let price = '';
    for (let i = 0; i < priceLevel; i++) {
      price += '$';
    }
    return price;
  }

  return (
    <Pressable style={styles.container} onPress={() => navigation.navigate("DetailsView", { Restaurant: restaurant })}
    > 
      <Image 
        testID="restaurant-image"
        source={{ uri: restaurant.image || images.defaultRestaurantImage }} 
        style={styles.image} 
        resizeMode='cover'
        
      />
      <View style={styles.textContainer}>
        <Pressable
          onPress={() => {
            setFindOnMapPressed(!isFindOnMapPressed);
            navigation.navigate("Map", { geometry: restaurant.geometry });
            console.log("Find on map pressed");
          }}
        >
          <View style={styles.iconContainer}>
            <Image source={{ uri: images.mapMarker }} style={styles.mapIcon} />
            <Text style={styles.findOnMap}>Find on map</Text>
          </View>
        </Pressable>
        <View style={styles.textInfo}>
          <Text style={styles.title}>{restaurant.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{fontWeight: 'bold'}}>
              Rating: {restaurant.rating !== undefined ? <StarRating rating={restaurant.rating} /> : "N/A"}
            </Text>
            <Text style={styles.distance}>{parseFloat(restaurant.distance).toFixed(1)}km</Text>
            <Text style={styles.distance}>{restaurant.price !== undefined ? displayPriceLevel(parseInt(restaurant.price)) : ""}</Text>
          </View>
        </View>

        <View style={styles.iconContainer}>
          <Pressable
            onPress={() => {
              if (isFavePressed) {
                setFavePressed(false);
              }
              setBookmarkPressed(!isBookmarkPressed);
              animateIcon(bookmarkScale);
            }}
          >
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

        <View style={styles.iconContainer}>
          <Pressable
            onPress={() => {
              if (isBookmarkPressed) {
                setBookmarkPressed(false);
              }
              setFavePressed(!isFavePressed);
              animateIcon(faveScale);
            }}
          >
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
