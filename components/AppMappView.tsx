import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import MapView, {
  Marker,
  Callout,
  Circle,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import MapViewStyle from "./../app/Utils/MapViewStyle.json";
import RestaurantMarker from "./../components/RestaurantMarker";
import { WebView } from "react-native-webview";
import StarRating from "./StarRating";
import { AppContext } from "./../model/AppContext";
import images from "@/assets/data/images";

interface AppMappViewProps {
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export default function AppMappView({ geometry }: AppMappViewProps) {
  const { location, localRestaurants } = useContext(AppContext);
  // if (!appContext)
  //   throw new Error("AppContext must be used within ContextProvider");

  // useEffect(() => {
  //   if (!localRestaurants.length && location) {
  //     appContext.setRestaurants(); // Fetch restaurants if not already loaded
  //   }
  // }, [location, appContext.setRestaurants]);

  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const mapRef = useRef<MapView>(null);
  const handleMapPress = () => setSelectedMarkerId(null);
  const markerRefs = useRef<(Marker | null)[]>([]);

  if (!location) return null; // Render nothing if no location is available

  // check if geometry is available and if the mapRef is available then move the map to the location of the selected restaurant
  useEffect(() => {
    if (geometry && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: geometry.location.lat,
        longitude: geometry.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000); 
    }
  }, [geometry]);

  // check if geometry is available then show the callout (restaurant details) of the selected restaurant
  useEffect(() => {
    if (geometry) {
      const markerIndex = localRestaurants.findIndex(
        restaurant => restaurant.geometry.location.lat === geometry.location.lat &&
                      restaurant.geometry.location.lng === geometry.location.lng
      );

      // remember to try start the map beforehand so it doesn't start from the user's location instead of the restaurant
      if (markerIndex !== -1 && markerRefs.current[markerIndex]) { 
        markerRefs.current[markerIndex].showCallout();
        setSelectedMarkerId(markerIndex);
      }
    }
  }, [geometry, localRestaurants]);

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
          {localRestaurants.map((restaurant, index) => (
            <Marker
              key={`${index}`}
              ref={ref => markerRefs.current[index] = ref}
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
              <Callout>
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
                          <img src="${restaurant.image != null ? restaurant.image : images.defaultRestaurantImage}" style="width: 100%; object-fit: cover;"/>
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
