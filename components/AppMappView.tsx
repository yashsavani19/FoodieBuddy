import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity, Modal, ScrollView } from "react-native";
import MapView, { Marker, Callout, Circle, PROVIDER_GOOGLE, MapMarker, Polyline } from "react-native-maps";
import MapViewStyle from "./../app/Utils/MapViewStyle.json";
import RestaurantMarker from "./../components/RestaurantMarker";
import { WebView } from "react-native-webview";
import StarRating from "./StarRating";
import { AppContext } from "../context/AppContext";
import images from "@/assets/data/images";
import { formatDistance } from "@/app/Utils/FormatDistance";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
import displayPriceLevel from "@/app/Utils/DisplayPriceLevel";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_API_KEY } from "@env";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
  const handleMapPress = () => setSelectedMarkerId(null);
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

  const getDirectionIcon = (instruction: string) => {
    if (instruction.toLowerCase().includes("turn left")) {
      return "arrow-left-bold";
    } else if (instruction.toLowerCase().includes("turn right")) {
      return "arrow-right-bold";
    } else {
      return "map-marker";
    }
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "WALKING" ? "DRIVING" : "WALKING"));
  };

  return (
    location && location.latitude && (
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
              <Callout tooltip={false}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.name}>{restaurant.name}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {restaurant.rating !== undefined && (
                      <StarRating rating={restaurant.rating} />
                    )}
                    <Text>
                      {" "}
                      {restaurant.price &&
                        displayPriceLevel(parseInt(restaurant.price))}
                    </Text>
                  </View>
                  <Text>Distance: {formatDistance(restaurant.distance)}</Text>
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
                    distanceText = (
                      parseFloat(distanceText) * 1609.34
                    ).toFixed(0) + " m";
                  } else if (distanceText.includes("ft")) {
                    distanceText = (
                      parseFloat(distanceText) * 0.3048
                    ).toFixed(0) + " m";
                  }
                  return { instruction, distance: distanceText };
                });
                setDirectionsSummary({
                  distance: result.distance.toFixed(1) + " km",
                  duration: result.duration.toFixed(0) + " min",
                  steps,
                });
                setModalVisible(true);
              }}
              onError={(errorMessage) => {
                console.log("Error in MapViewDirections:", errorMessage);
              }}
            />
          )}
        </MapView>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="directions" size={20} color="#fff" />
          <Text style={styles.directionsButtonText}>Show Directions</Text>
        </TouchableOpacity>
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
                  <Icon
                    name="walk"
                    size={30}
                    color={mode === "WALKING" ? "#e46860" : "#fff"}
                  />
                  <Icon
                    name="car"
                    size={30}
                    color={mode === "DRIVING" ? "#e46860" : "#fff"}
                  />
                  <Text style={styles.modeToggleText}>
                    {mode === "WALKING" ? "Walking Directions" : "Driving Directions"}
                  </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.directionsSummaryText}>
                Distance: {directionsSummary?.distance} | 
                Duration: {directionsSummary?.duration}
              </Text>
              <ScrollView style={styles.directionsList}>
                {directionsSummary?.steps.map((step, index) => (
                  <View key={index} style={styles.stepContainer}>
                    <Icon
                      name={getDirectionIcon(step.instruction)}
                      size={20}
                      color="#555"
                      style={styles.stepIcon}
                    />
                    <View style={styles.stepInstructionContainer}>
                      <Text style={styles.stepInstruction}>
                        {step.instruction}
                      </Text>
                      <Text style={styles.stepDistance}>
                        ({step.distance})
                      </Text>
                    </View>
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
  calloutContainer: {
    width: 250,
    height: 250,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  directionsButton: {
    position: "absolute",
    bottom: 18,
    left: "73%",
    transform: [{ translateX: -50 }],
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
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
  },
  webViewStyle: {
    width: 250,
    height: 150,
    marginBottom: 5,
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
    paddingBottom: 5,
    alignContent: "space-between",
    fontWeight: "bold",
  },
  directionsList: {
    width: "100%",
    height: 200,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
    flexWrap: 'wrap',
    maxWidth: '90%',
  },
  stepDistance: {
    fontSize: 14,
    color: "#555",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "100%"
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  },
});
