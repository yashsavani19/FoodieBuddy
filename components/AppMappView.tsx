import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Modal } from "react-native";
import MapView, { Marker, Callout, Circle, PROVIDER_GOOGLE, MapMarker } from "react-native-maps";
import MapViewStyle from "../app/Utils/MapViewStyle.json";
import RestaurantMarker from "./RestaurantMarker";
import { AppContext } from "../context/AppContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_API_KEY } from "@env";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CustomCallout from "./CustomCallout";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import DirectionModal from "./DirectionModal";

interface AppMappViewProps {
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export default function AppMappView({ geometry }: AppMappViewProps) {
  const { location, filteredRestaurants } = useContext(AppContext);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const mapRef = useRef<MapView>(null);
  const handleMapPress = () => {
    setSelectedMarkerId(null);
    setDirections(null);
  };
  const markerRefs = useRef<(MapMarker | null)[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [directions, setDirections] = useState<{
    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number };
  } | null>(null);
  const [directionsSummary, setDirectionsSummary] = useState<{
    distance: string;
    duration: string;
    steps: Array<{ instruction: string; distance: string }>;
  } | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<"WALKING" | "DRIVING">("WALKING");

  if (!location) return null;

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

  useEffect(() => {
    setDirections(null);
    setDirectionsSummary(null);
    setSelectedMarkerId(null);
  }, [filteredRestaurants]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "WALKING" ? "DRIVING" : "WALKING"));
  };

  return (
    location &&
    location.latitude && (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          followsUserLocation={true}
          customMapStyle={MapViewStyle}
          showsCompass={true}
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
          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={1050}
            fillColor="rgba(173, 216, 230, 0.2)"
            strokeColor="rgba(173, 216, 230, 0.2)"
            strokeWidth={2}
          />
          {filteredRestaurants.map((restaurant, index) => (
            <Marker
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
                  setDirections({
                    origin: {
                      latitude: location.latitude,
                      longitude: location.longitude,
                    },
                    destination: {
                      latitude: restaurant.geometry.location.lat,
                      longitude: restaurant.geometry.location.lng,
                    },
                  });
                  setSelectedMarkerId(index);
                }
              }}
            >
              <RestaurantMarker
                rating={restaurant.rating === 0 || restaurant.rating === undefined ? "N/A" : restaurant.rating }
                price={restaurant.price ?? "N/A"}
                selected={selectedMarkerId === index}
              />
              <Callout tooltip
                onPress={() => {
                  if (selectedMarkerId !== null) {
                    navigation.navigate("DetailsView", {
                      Restaurant: filteredRestaurants[selectedMarkerId],
                    });
                  }
                }}
              >
                <CustomCallout
                  name={restaurant.name}
                  rating={restaurant.rating}
                  image={restaurant.image}
                />
              </Callout>
            </Marker>
          ))}
          {directions && (
            <MapViewDirections
              origin={directions.origin}
              destination={directions.destination}
              apikey={GOOGLE_API_KEY}
              mode={mode}
              strokeWidth={3}
              strokeColor="#e46860"
              onReady={(result) => {
                const steps = result.legs[0].steps.map((step) => {
                  const instruction = step.html_instructions
                    .replace(/<[^>]+>/g, "")
                    .replace(/(?<=\w)(?=[A-Z])/g, " ");
                  let distanceText = step.distance.text;
                  if (distanceText.includes("mi")) {
                    distanceText =
                      (parseFloat(distanceText) * 1609.34).toFixed(0) + " m";
                  } else if (distanceText.includes("ft")) {
                    distanceText =
                      (parseFloat(distanceText) * 0.3048).toFixed(0) + " m";
                  }
                  return { instruction, distance: distanceText };
                });
                setDirectionsSummary({
                  distance: result.distance.toFixed(1) + " km",
                  duration: result.duration.toFixed(0) + " min",
                  steps,
                });
              }}
              onError={(errorMessage) => {
                console.log("Error in MapViewDirections:", errorMessage);
              }}
            />
          )}
        </MapView>
        {selectedMarkerId !== null && (
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => setModalVisible(true)}
          >
            <MaterialCommunityIcons name="directions" size={wp('6%')} color="#5A5A5A" />
          </TouchableOpacity>
        )}
        <DirectionModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          directionsSummary={directionsSummary}
          mode={mode}
          toggleMode={toggleMode}
        />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  directionsButton: {
    position: "absolute",
    top: wp('15%'),
    transform: [{ translateX: -wp('3%') }],
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: wp("1.8%"),
    borderRadius: wp("0.5%"),
    alignItems: "center",
    alignSelf: 'flex-end'
  },
});