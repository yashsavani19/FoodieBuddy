import React, { useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
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
import { AppContext } from "../context/AppContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_API_KEY } from "@env";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";
import { getDirectionIcon } from "@/app/Utils/directionIcons";
import CustomCallout from "./../components/CustomCallout";

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
                rating={restaurant.rating ?? "N/A"}
                price={restaurant.price ?? "N/A"}
                selected={selectedMarkerId === index}
              />
              <Callout tooltip>
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
            <MaterialCommunityIcons name="directions" size={25} color="#5A5A5A" />
          </TouchableOpacity>
        )}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modeToggleWrapper}
                onPress={toggleMode}
              >
                <View style={styles.modeToggleContainer}>
                  <MaterialCommunityIcons
                    name="walk"
                    size={25}
                    color={mode === "WALKING" ? "#e46860" : "#fff"}
                  />
                  <MaterialCommunityIcons
                    name="car"
                    size={30}
                    color={mode === "DRIVING" ? "#e46860" : "#fff"}
                  />
                  <Text style={styles.modeToggleText}>
                    {mode === "WALKING"
                      ? "Walking Directions"
                      : "Driving Directions"}
                  </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.directionsSummaryText}>
                Distance: {directionsSummary?.distance} | Duration:{" "}
                {directionsSummary?.duration}
              </Text>
              <ScrollView style={styles.directionsList}>
                {directionsSummary?.steps.map((step, index) => (
                  <View key={index}>
                    <View style={styles.stepContainer}>
                      <MaterialIcons
                        name={getDirectionIcon(step.instruction)}
                        size={25}
                        color="black"
                        style={styles.stepIcon}
                      />
                      <View style={styles.stepInstructionContainer}>
                        <Text style={styles.stepInstruction}>
                          {step.instruction}
                        </Text>
                        <Text style={styles.stepDistance}>
                          {" "}
                           ({step.distance})
                        </Text>
                      </View>
                    </View>
                    {index < directionsSummary.steps.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  directionsButton: {
    position: "absolute",
    top: 60,
    left: "100%",
    transform: [{ translateX: -50 }],
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  directionsButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
  modeToggleWrapper: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  modeToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modeToggleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
    left: 18,
  },
  webViewStyle: {
    width: 230,
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  directionsSummaryText: {
    fontSize: 16,
    marginVertical: 0,
    paddingBottom: 2,
    alignContent: "space-between",
    fontWeight: "bold",
    marginBottom: 10,
  },
  directionsList: {
    width: "100%",
    height: 200,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 5,
  },
  stepIcon: {
    marginRight: 10,
  },
  stepInstructionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  stepInstruction: {
    fontSize: 14,
    color: "#555",
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: "90%",
  },
  stepDistance: {
    fontSize: 14,
    color: "#555",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 3,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "100%",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
  },
});
