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

export default function AppMappView() {
  const { location } = useContext(UserLocationContext);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

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
              key={index}
              coordinate={{
                latitude: restaurant.geometry.location.lat,
                longitude: restaurant.geometry.location.lng,
              }}
            >
              {/*Information on Restaurant*/}
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text style={styles.name}>{restaurant.name}</Text>
                  <Text>Rating: {restaurant.rating}</Text>
                  {restaurant.image && (
                    <Image
                      source={
                        restaurant.image
                          ? { uri: restaurant.image }
                          : { uri: "https://via.placeholder.com/100" }
                      }
                      style={styles.image}
                    />
                  )}
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
});
