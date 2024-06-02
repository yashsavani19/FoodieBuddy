import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Linking,
  ScrollView,
  Animated,
  Modal as RNModal
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Restaurant } from "@/model/Restaurant";
import TitleHeader from "@/components/TitleHeader";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import images from "@/assets/data/images";
import { AppContext } from "@/context/AppContext";
import { formatDistance } from "@/app/Utils/FormatDistance";
import displayPriceLevel from "@/app/Utils/DisplayPriceLevel";
import MapView, { Marker } from "react-native-maps";
import MapViewStyle from "./../app/Utils/MapViewStyle.json";
import BackButton from "./BackButton";
import ShareButton from "./ShareButton";
import { OpenStatusLabelList } from "./OpenIndicatorComponents/OpenStatusLabel";
import Constants from "expo-constants";
import { RootStackParamList } from "@/constants/navigationTypes";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { OpenTimesCard, OpenTimesLabel, openTimesContent } from "./OpenIndicatorComponents/OpenTimesComponents";
import OpenTimesCardsContainer from "./OpenIndicatorComponents/OpenTimesCardsContainer";

const default_pic = require("@/assets/images/default_pic.png");
const visited_selected = require("@/assets/images/visited-Selected.png");
const visited_unselected = require("@/assets/images/visited-unselected-icon.png");
const star_icon = require("@/assets/images/star-icon.png");
const phone_icon = require("@/assets/images/phone-icon.png");
const website_icon = require("@/assets/images/web-icon.png");
const distance_icon = require("@/assets/images/walking_distance-icon.png");
const location_icon = require("@/assets/images/location.png");
const price_icon = require("@/assets/images/price-tag.png");

interface DetailsViewComponentsProps {
  restaurant: Restaurant;
  backFunction: () => void;
}

const DetailsViewComponents: React.FC<DetailsViewComponentsProps> = ({
  restaurant,
  backFunction,
}) => {
  const {
    name,
    image,
    displayAddress,
    rating,
    phone,
    website,
    distance,
    price,
    currentOpeningHours,
  } = restaurant;

  const {
    location, // Extract location from context
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
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);

  const bookmarkScale = useState(new Animated.Value(1))[0];
  const faveScale = useState(new Animated.Value(1))[0];
  const visitedScale = useState(new Animated.Value(1))[0];

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const mapRef = useRef<MapView>(null);

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

  const handleCenterMapPress = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: restaurant.geometry.location.lat,
          longitude: restaurant.geometry.location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  const handleMapViewPress = () => {
    if (location) {
      console.log("Navigating to Map with params:", {
        geometry: restaurant.geometry,
        directions: {
          origin: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          destination: {
            latitude: restaurant.geometry.location.lat,
            longitude: restaurant.geometry.location.lng,
          },
        },
        restaurantId: restaurant.id 
      });
      navigation.navigate("Map", {
        geometry: restaurant.geometry,
        directions: {
          origin: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          destination: {
            latitude: restaurant.geometry.location.lat,
            longitude: restaurant.geometry.location.lng,
          },
        },
        restaurantId: restaurant.id 
      });
    }
  };
  

  const handleWebsitePress = (websiteUrl: string) => {
    if (websiteUrl) {
      Linking.openURL(websiteUrl);
      console.log(`Opening website: ${websiteUrl}`);
    } else {
      console.log("No website URL provided.");
    }
  };

  return (
    <View style={styles.container}>
      <TitleHeader title="Details" />

      <View style={styles.contentContainer}>
        <View>
          <BackButton />
        </View>
        <ScrollView style={{ paddingHorizontal: wp("4%") }}>
          <View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.restaurantTitle}>{name}</Text>
              <TouchableOpacity style={styles.imageContainer} onPress={() => setImageViewerVisible(true)}>
                <Image
                  source={image ? { uri: image } : default_pic}
                  style={styles.restaurantImage}
                />
                <OpenStatusLabelList restaurant={restaurant} />
              </TouchableOpacity>
            </View>
            <View style={styles.interactionContainer}>
              <View style={styles.iconContainer}>
                <Pressable onPress={handleVisitedPress}>
                  <Animated.Image
                    source={
                      isVisitedPressed ? visited_selected : visited_unselected
                    }
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
              <View style={styles.iconContainer}>
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
              <View style={styles.iconContainer}>
                <ShareButton restaurant={restaurant} size={24} />
              </View>
            </View>
          </View>

          <View style={styles.restaurantDetailsContainer}>
            <View style={styles.leftContainer}>
              <View style={styles.detailTextContainer}>
                <Image source={star_icon} style={styles.smallIcon} />
                <Text style={styles.infoText}>
                  {rating ? `${rating} / 5` : `N/A`}
                </Text>
              </View>

              <View style={styles.detailTextContainer}>
                <Image source={price_icon} style={styles.smallIcon} />
                <Text style={styles.infoText}>
                  {price ? displayPriceLevel(parseInt(price)) : `N/A`}
                </Text>
              </View>

              <View style={styles.detailTextContainer}>
                <Image source={phone_icon} style={styles.smallIcon} />
                <Text
                  selectable={phone != undefined}
                  style={phone ? styles.linkText : styles.infoText}
                >
                  {phone ? phone.replace(/\s/g, "") : `N/A`}
                </Text>
              </View>

              <View style={styles.detailTextContainer}>
                <Image source={website_icon} style={styles.smallIcon} />
                <Text
                  onPress={() => handleWebsitePress(restaurant.website)}
                  style={styles.linkText}
                >
                  {website ? `Website` : `N/A`}
                </Text>
              </View>
            </View>

            <View style={styles.rightContainer}>
              <View style={styles.detailTextContainer}>
                <Image
                  source={location_icon}
                  style={[styles.smallIcon, { marginTop: hp("0.6%") }]}
                />
                <Text selectable={true} style={styles.infoText}>
                  {displayAddress}
                </Text>
              </View>
              <View style={styles.detailTextContainer}>
                <Image
                  source={distance_icon}
                  style={[styles.smallIcon, { marginTop: hp("0.3%") }]}
                />
                <Text style={styles.infoText}>{formatDistance(distance)}</Text>
              </View>
              <OpenTimesLabel restaurant={restaurant} />
            </View>
          </View>

          <OpenTimesCardsContainer>
            {openTimesContent(restaurant)?.openTimes.map((openTime: any) => (
                <OpenTimesCard restaurant={restaurant} openTime={openTime} key={openTime?.day}></OpenTimesCard>
            ))}
          </OpenTimesCardsContainer>

          <View style={{ paddingVertical: hp("1%") }} />
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              customMapStyle={MapViewStyle}
              initialRegion={{
                latitude: restaurant.geometry.location.lat,
                longitude: restaurant.geometry.location.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: restaurant.geometry.location.lat,
                  longitude: restaurant.geometry.location.lng,
                }}
                title={restaurant.name}
              />
            </MapView>
            <View style={styles.mapButtonsContainer}>
              <TouchableOpacity
                style={styles.mapButton}
                onPress={handleCenterMapPress}
              >
                <MaterialIcons name="my-location" size={24} color="#5A5A5A" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mapButton}
                onPress={handleMapViewPress}
              >
                <MaterialIcons name="map" size={24} color="#5A5A5A" />
              </TouchableOpacity>
            </View>
          </View>
          <RNModal
            visible={isImageViewerVisible}
            transparent={true}
            onRequestClose={() => setImageViewerVisible(false)}
          >
            <View style={styles.imageViewerContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setImageViewerVisible(false)}
              >
                <AntDesign name="close" size={30} color="white" />
              </TouchableOpacity>
              <Image
                  source={image ? { uri: image } : default_pic}
                  style={styles.restaurantImage}
                />
            </View>
          </RNModal>
        </ScrollView>
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
    paddingBottom: hp("5%"),
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonContainer: {
    width: "100%",
    height: "auto",
    alignItems: "center",
    padding: hp("1%"),
    backgroundColor: "#363232",
    fontSize: wp("5%"),
  },
  backButton: {
    fontSize: wp("4%"),
    color: "white",
    fontWeight: "bold",
  },
  contentContainer: {
    width: "100%",
    marginTop: Constants.statusBarHeight + 100,
  },
  restaurantTitle: {
    fontSize: wp("6.5%"),
    fontWeight: "bold",
    color: "black",
    marginTop: hp("1%"),
    textAlign: "center",
  },
  iconContainer: {
    alignItems: "center",
  },
  smallIcon: {
    width: wp("5%"),
    height: wp("5%"),
    resizeMode: "contain",
  },
  imageContainer: {
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  interactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: hp("1%"),
  },
  restaurantDetailsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: wp("5%"),
  },
  leftContainer: {
    width: "50%",
  },
  rightContainer: {
    width: "50%",
  },
  restaurantImage: {
    width: "100%",
    height: hp("25%"),
    borderRadius: wp("2.5%"),
    marginTop: hp("1%"),
  },
  mapLinkText: {
    backgroundColor: "#0066CC",
    color: "white",
    padding: wp("2%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("1%"),
    textAlign: "center",
    fontWeight: "bold",
    fontSize: wp("3.5%"),
  },
  infoText: {
    fontSize: wp("3.5%"),
    color: "#333",
    marginLeft: wp("1.5%"),
    marginVertical: hp("0.5%"),
    textAlign: "left",
    flex: 1,
  },
  linkText: {
    fontSize: wp("3.5%"),
    color: "black",
    marginLeft: wp("1.5%"),
    textAlign: "left",
    textDecorationLine: "underline",
    flex: 1,
  },
  detailTextContainer: {
    marginVertical: hp("0.5%"),
    flexDirection: "row",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapContainer: {
    flex: 1,
    borderRadius: wp("2.5%"),
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    height: hp("37.5%"),
    marginBottom: hp("2.5%"),
  },
  mapButtonsContainer: {
    position: "absolute",
    top: hp("1%"),
    right: wp("2%"),
    alignItems: "center",
  },
  mapButton: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: wp("2%"),
    borderRadius: wp("1%"),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("1%"),
  },
  header: {
    height: hp("5%"),
    backgroundColor: "black",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerContent: {
    height: hp("5%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp("2.5%"),
  },
  title: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "white",
  },
});

export default DetailsViewComponents;
