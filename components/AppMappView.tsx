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
            radius={200} // Adjust the radius as needed
            fillColor="rgba(173, 216, 230, 0.2)" // Light blue color with 50% opacity
            strokeColor="rgba(173, 216, 230, 0.2)" // Border color (blue) with 50% opacity
            strokeWidth={2} // Border width
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
              {/* Customized marker with callout */}
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text style={styles.name}>{restaurant.name}</Text>
                  <Text>Rating: {restaurant.rating}</Text>
                  <Image
                    source={{
                      uri:
                        restaurant.image || "https://via.placeholder.com/100",
                    }} // Use placeholder image if restaurant image is not available
                    style={styles.image} // Adjust dimensions as needed
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
    width: 200, // Adjust the width of the callout container
    padding: 4,
  },
  name:{
    fontWeight: 'bold',
  },
  image: {
    width: "100%", // Adjust the width to fill the container
    height: 100, // Adjust the height as needed
    borderRadius: 5, // Add border radius for a nicer look
  },
});
