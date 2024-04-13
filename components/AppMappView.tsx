import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import MapView, {
  Marker,
  Callout,
  Circle,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import MapViewStyle from "./../app/Utils/MapViewStyle.json";
import { UserLocationContext } from "./../app/(tabs)/Context/UserLocationContext";
import fetchNearbyRestaurants from "./../components/FetchNearbyRestaurants";
import RestaurantMarker from "./../components/RestaurantMarker";
import { WebView } from "react-native-webview";
import StarRating from "./StarRating";

export default function AppMappView() {
  const { location } = useContext(UserLocationContext);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (location) {
        try {
          console.log("Fetching nearby restaurants...");
          const results = await fetchNearbyRestaurants(
            location.latitude,
            location.longitude
          );
          console.log("Nearby restaurants:", results);
          setRestaurants(results);
        } catch (error) {
          console.error("Error fetching nearby restaurants:", error);
        }
      }
    };

    fetchRestaurants();
  }, [location]);

  const handleMapPress = () => {
    if (selectedMarkerId !== null) {
      setSelectedMarkerId(null); 
    }
  };

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
          {restaurants.map((restaurant, index) => (
            <Marker
              key={`${index}`}
              coordinate={{
                latitude: restaurant.geometry.location.lat,
                longitude: restaurant.geometry.location.lng,
              }}
              onPress={() => {
                if (selectedMarkerId === index) {
                  setSelectedMarkerId(null); // Deselect if the same marker is clicked
                } else {
                  setSelectedMarkerId(index); // Select new marker
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
                  <StarRating rating={restaurant.rating}/>
                  <WebView
                    style={styles.webViewStyle}
                    source={{
                      html: `<img src="${restaurant.image}" style="width: 100%; height: auto;" />`,
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
