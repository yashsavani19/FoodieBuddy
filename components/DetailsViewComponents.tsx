import { Restaurant } from "@/model/Restaurant";
import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

//Image imports
import "@/assets/images/default_pic.png";
const default_pic = require("@/assets/images/default_pic.png");
import "@/assets/images/fave-icon.png";
const fave_unselected = require("@/assets/images/fave-icon.png");
import "@/assets/images/fave-Selected.png";
const fave_selected = require("@/assets/images/fave-Selected.png");
import "@/assets/images/bookmark-icon.png";
const bookmark_unselected = require("@/assets/images/bookmark-icon.png");
import "@/assets/images/bookmark-Selected.png";
const bookmard_selected = require("@/assets/images/bookmark-Selected.png");
import "@/assets/images/visited-Selected.png";
const visited_selected = require("@/assets/images/bookmark-Selected.png");

interface DetailsViewComponents {
  restaurant: Restaurant;
}

const DetailsViewComponents: React.FC<DetailsViewComponents> = ({
  restaurant,
}) => {
  const title = restaurant.name;
  const image = restaurant.image || default_pic;
  const address = restaurant.displayAddress || "Address not available";
  const rating = restaurant.rating || "Rating not available";
  const price = restaurant.price || "Price not available";
  const phone = restaurant.phone || "Phone not available";
  const website = restaurant.website || "Website not available";
  const distance = restaurant.distance || "Distance not available";
  const markAsFavorite = restaurant.isFavourite || false;
  const markAsBookmarked = restaurant.isBookmarked || false;
  const markAsVisited = restaurant.isVisited || false;

//   if (markAsFavorite) {
//     return (
//       <View>
//         <Image source={fave_selected} style={styles.smallIcon} />
//       </View>
//     );
//   } else {
//     return (
//       <View>
//         <Image source={fave_unselected} style={styles.smallIcon} />
//       </View>
//     );
//   }

//   if (markAsBookmarked) {
//     return (
//       <View>
//         <Image source={bookmard_selected} style={styles.smallIcon} />
//       </View>
//     );
//   } else {
//     return (
//       <View>
//         <Image source={bookmark_unselected} style={styles.smallIcon} />
//       </View>
//     );
//   }

//   if (markAsVisited) {
//     return (
//       <View>
//         <Image source={visited_selected} style={styles.smallIcon} />
//       </View>
//     );
//   }

  return (
    <View>
      <Text style={styles.restaurantTitle}>{restaurant.name}</Text>
      <Image source={{ uri: image }} style={styles.restaurantImage} />
      <Text style={styles.addressRating}>{address}</Text>
      <Text style={styles.addressRating}>{rating}</Text>
      <Text style={styles.restaurantPrice}>{price}</Text>
      <Text style={styles.phoneWebsite}>{phone}</Text>
      <Text style={styles.phoneWebsite}>{website}</Text>
      <Text style={styles.restaurantDistance}>{distance}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  restaurantTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  smallIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  restaurantImage: {
    width: "100%",
    aspectRatio: 2.5 / 1,
    borderRadius: 10,
  },
  addressRating: {
    fontSize: 16,
    marginBottom: 5,
  },
  restaurantPrice: {
    fontSize: 16,
    marginBottom: 5,
  },
  phoneWebsite: {
    fontSize: 16,
    marginBottom: 5,
  },
  restaurantDistance: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DetailsViewComponents;
