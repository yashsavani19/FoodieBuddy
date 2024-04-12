import EditScreenInfo from "@/components/EditScreenInfo";
//import {View} from '@/components/Themed';

import { PermissionsAndroid, TouchableOpacity } from "react-native";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "@env";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.02;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
  latitude: -36.8485,
  longitude: 174.7633,
  latitudeDelta: 0.09,
  longitudeDelta: 0.04,
};

interface Restaurant {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
}

type InputAutoCompleteProps = {
  label: string;
  placeholder: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};

function InputAutoComplete({
  label,
  placeholder,
  onPlaceSelected,
}: InputAutoCompleteProps) {
  return (
    <>
      <Text>{label}</Text>
      <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ""}
        fetchDetails
        onPress={(data, details = null) => {
          onPlaceSelected(details);
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: "en",
        }}
      />
    </>
  );
}

export default function Map() {
  const [origin, setOrigin] = useState<LatLng | null>();
  const [destination, setDestination] = useState<LatLng | null>();
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>();
  const [showDirections, setShowDirections] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    async function fetchCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      moveTo({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Function to re-center map on the current location
      const centerOnUser = () => {
        if (currentLocation) {
          mapRef.current?.animateCamera(
            {
              center: {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              },
              pitch: 0,
              heading: 0,
              altitude: 0,
              zoom: 15, // You can adjust the zoom level as needed
            },
            { duration: 1000 }
          ); // Animation duration in ms
        } else {
          console.error("Current location is not available");
        }
      };

      fetchNearbyRestaurants(
        location.coords.latitude,
        location.coords.longitude
      );
    }

    fetchCurrentLocation();
  }, []);

  const fetchNearbyRestaurants = async (
    latitude: number,
    longitude: number
  ) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${GOOGLE_API_KEY}`;
    try {
      const response = await axios.get(apiUrl);
      setRestaurants(response.data.results);
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
    }
  };

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const changeZoom = (factor: number) => {
    mapRef.current?.getCamera().then((camera) => {
      if (camera && camera.zoom !== undefined) {
        camera.zoom += factor;
        mapRef.current?.animateCamera(camera, { duration: 1000 });
      }
    });
  };

  const edgePaddingValue = 150;
  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  const traceRouteOnReady = (args: any) => {
    if (args) {
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true);
      mapRef.current?.fitToCoordinates([origin, destination], { edgePadding });
    }
  };

  const onPlaceSelected = (
    details: GooglePlaceDetail | null,
    flag: "origin" | "destination"
  ) => {
    const set = flag === "origin" ? setOrigin : setDestination;
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };
    set(position);
    moveTo(position);
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_POSITION}
      >
        {currentLocation && (
          <Marker coordinate={currentLocation} title="You are here" />
        )}
        {restaurants.map((restaurant, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: restaurant.geometry.location.lat,
              longitude: restaurant.geometry.location.lng,
            }}
            title={restaurant.name}
          />
        ))}
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeColor="#6644ff"
            strokeWidth={4}
            onReady={traceRouteOnReady}
          />
        )}
      </MapView>
      <View style={styles.searchContainer}>
        <InputAutoComplete
          label="Origin"
          onPlaceSelected={(details) => {
            onPlaceSelected(details, "origin");
          }}
          placeholder={"Enter Origin"}
        />
        <InputAutoComplete
          label="Destination"
          onPlaceSelected={(details) => {
            onPlaceSelected(details, "destination");
          }}
          placeholder={"Enter Destination"}
        />
        <TouchableOpacity style={styles.button} onPress={traceRoute}>
          <Text style={styles.buttonText}>Trace route</Text>
        </TouchableOpacity>
        <View style={styles.zoomButtons}>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => changeZoom(1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => changeZoom(-1)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.centerButton}
            onPress={() => {
              if (currentLocation) {
                mapRef.current?.animateToRegion(
                  {
                    ...currentLocation,
                    latitudeDelta: INITIAL_POSITION.latitudeDelta,
                    longitudeDelta: INITIAL_POSITION.longitudeDelta,
                  },
                  1000
                ); 
              }
            }}
          >
            <Text style={styles.buttonText}>Center on Me</Text>
          </TouchableOpacity>
        </View>
        {distance && duration ? (
          <View>
            <Text>Distance: {distance.toFixed(2)}</Text>
            <Text>Duration: {Math.ceil(duration)} min</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#bbb",
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: "center",
  },
  zoomButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  zoomButton: {
    backgroundColor: "#bbb",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 4,
  },
  centerButton: {
    backgroundColor: "#bbb",
    padding: 10,
    borderRadius: 4,
  },
});
