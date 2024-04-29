import React, { useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Linking,
  ActivityIndicator,
} from "react-native";
import MapView, {
  Marker,
  Callout,
  Circle,
  PROVIDER_GOOGLE,
  MapMarker,
} from "react-native-maps";

import MapViewStyle from "./../app/Utils/MapViewStyle.json";
import RestaurantMarker from "./../components/RestaurantMarker";
import { WebView } from "react-native-webview";
import StarRating from "./StarRating";
import { AppContext } from "../context/AppContext";
import images from "@/assets/data/images";
import { Category } from "@/model/Category";
import Colors from "@/constants/Colors";

// Define the props for the AppMapView component
interface AppMappViewProps {
  searchTerm?: string;
  selectedCategory?: Category;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

// Define the AppMapView component
export default function AppMappView({
  searchTerm,
  selectedCategory,
  geometry,
}: AppMappViewProps) {
  const { location, localRestaurants } = useContext(AppContext);
  const [filteredRestaurants, setFilteredRestaurants] =
    useState(localRestaurants);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const mapRef = useRef<MapView>(null);
  const handleMapPress = () => setSelectedMarkerId(null);
  const markerRefs = useRef<(MapMarker | null)[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Return nothing if no location is available
  if (!location) return null;

  // Handle filtering of restaurants based on search term and selected category
  useEffect(() => {
    let result = localRestaurants;

    if (selectedCategory && selectedCategory.name !== "All") {
      if (
        selectedCategory &&
        ["Restaurant", "Bar", "Bakery", "Cafe"].includes(selectedCategory.name)
      ) {
        result = result.filter((restaurant) => {
          return (
            restaurant.categories &&
            restaurant.categories
              .map((category) => category.toLowerCase())
              .includes(selectedCategory.name.toLowerCase())
          );
        });
      } else {
        result = result.filter((restaurant) => {
          return (
            restaurant.name &&
            restaurant.name
              .toLowerCase()
              .includes(selectedCategory.name.toLowerCase())
          );
        });
      }
    }

    if (searchTerm) {
      result = result.filter((restaurant) => {
        return (
          restaurant.name &&
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredRestaurants(result);
  }, [searchTerm, selectedCategory, localRestaurants]);

  // Effect to animate map to selected restaurant's location
  useEffect(() => {
    if (geometry && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: geometry.location.lat,
          longitude: geometry.location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [geometry, mapReady]);

  // Effect to show callout for selected restaurant
  useEffect(() => {
    if (geometry) {
      const markerIndex = filteredRestaurants.findIndex(
        (restaurant) =>
          restaurant.geometry.location.lat === geometry.location.lat &&
          restaurant.geometry.location.lng === geometry.location.lng
      );
      if (markerIndex !== -1 && markerRefs.current[markerIndex]) {
        markerRefs.current[markerIndex]?.showCallout();
        setSelectedMarkerId(markerIndex);
      }
    }
  }, [geometry, mapReady, filteredRestaurants]);

  const handleCalloutPress = (websiteUrl: string) => {
    if (websiteUrl) {
      // Open the restaurant's website in the device's browser
      Linking.openURL(websiteUrl);
      // Log a message to the console
      console.log(`Opening website: ${websiteUrl}`);
    } else {
      console.log("No website URL provided.");
    }
  };

  // Render the component
  return (
    location &&
    location.latitude && (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          customMapStyle={MapViewStyle}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0422,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
          ref={mapRef}
          onMapReady={() => setMapReady(true)}
        >
          {/* Blue transparent circle around the user's current location */}
          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={200}
            fillColor="rgba(173, 216, 230, 0.2)"
            strokeColor="rgba(173, 216, 230, 0.2)"
            strokeWidth={2}
          />

          {/* Render markers for each nearby restaurant */}
          {filteredRestaurants.map((restaurant, index) => (
            <Marker
              testID="Marker"
              key={`${index}`}
              ref={(ref) => (markerRefs.current[index] = ref)}
              coordinate={{
                latitude: restaurant.geometry.location.lat,
                longitude: restaurant.geometry.location.lng,
              }}
              onPress={() => {
                if (selectedMarkerId === index) {
                  setSelectedMarkerId(null);
                } else {
                  setSelectedMarkerId(index);
                }
              }}
            >
              <RestaurantMarker
                rating={restaurant.rating ?? "N/A"}
                selected={selectedMarkerId === index}
              />
              {/*Information on Restaurant*/}
              <Callout onPress={() => handleCalloutPress(restaurant.website)}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.name}>{restaurant.name}</Text>
                  {restaurant.rating !== undefined && (
                    <StarRating rating={restaurant.rating} />
                  )}
                  <Text>Distance: {restaurant.distance} km</Text>
                  <WebView
                    style={styles.webViewStyle}
                    source={{
                      html: `
                        <div style="display: flex; justify-content: center; height: 100%; width: 100%; object-fit: cover; object-position: center"">
                          <img src="${
                            restaurant.image != null
                              ? restaurant.image
                              : images.defaultRestaurantImage
                          }" style="width: 100%; object-fit: cover;"/>
                        </div>
                      `,
                    }}
                    automaticallyAdjustContentInsets={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                  />
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  calloutContainer: {
    width: 200,
    padding: 4,
  },
  name: {
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  webViewStyle: {
    height: 100,
    width: 190,
  },
});
