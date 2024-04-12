
import EditScreenInfo from "@/components/EditScreenInfo";
//import {View} from '@/components/Themed';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Callout, LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "@env";
import Constants from "expo-constants";
import { FC, useEffect, useRef, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import axios from "axios";
// Initial position for the map
const INITIAL_POSITION = {
  latitude: -36.8485,
  longitude: 174.7633,
  latitudeDelta: 0.09,
  longitudeDelta: 0.04,
};
// Interface for defining props of the RestaurantMarker component
interface RestaurantMarkerProps {
  rating: number | string;
}
// Interface for defining structure of Restaurant object
interface Restaurant {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  name: string;
  rating?: number;
  details?: {
    rating: string;
    phoneNumber?: string;
    photoUrl?: string | null;
  };
}
// Interface for defining props of InputAutoComplete component
type InputAutoCompleteProps = {
  label: string;
  placeholder: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};
// InputAutoComplete component for handling autocomplete input fields
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
// Map component
export default function Map() {
  // State variables
  const [origin, setOrigin] = useState<LatLng | null>();
  const [destination, setDestination] = useState<LatLng | null>();
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>();
  const [showDirections, setShowDirections] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  
  
  // Ref for the MapView component
  const mapRef = useRef<MapView>(null);
  
  // useEffect hook for fetching current location and nearby restaurants on component mount
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
      fetchNearbyRestaurants(
        location.coords.latitude,
        location.coords.longitude
      );
    }
    fetchCurrentLocation();
  }, []);
  // Function to fetch nearby restaurants
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
  const fetchRestaurantDetails = async (placeId: string, index: number) => {
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,photos&key=${GOOGLE_API_KEY}`;
  try {
    const response = await axios.get(detailsUrl);
    const result = response.data.result;
    const photoUrl = result.photos && result.photos.length > 0 ? getPhotoUrl(result.photos[0].photo_reference) : null;
    
    const updatedRestaurants = [...restaurants]; // Copy the current state
    updatedRestaurants[index].details = { // Update only the specific restaurant's details
      rating: result.rating,
      phoneNumber: result.formatted_phone_number,
      photoUrl: photoUrl
    };
    setRestaurants(updatedRestaurants); // Set the updated array back to the state
  } catch (error) {
    console.error("Failed to fetch restaurant details:", error);
  }
};

const handleMarkerPress = (placeId: string, index: number) => {
  fetchRestaurantDetails(placeId, index);
};

  const getPhotoUrl = (photoReference: string) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
  };
  
  
  // Function to move the map to a specific position
  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };
  // Function called when route trace is ready
  const traceRouteOnReady = (args: any) => {
    if (args) {
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };
  // Function to trace the route between origin and destination
  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true);
      mapRef.current?.fitToCoordinates([origin, destination]);
    }
  };
  // Function called when a place is selected from autocomplete
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
  // Rendering the map component
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_POSITION}
      >
        {/* Current location marker */}
        {currentLocation && (
          <Marker coordinate={currentLocation} title="You are here">
            <View style={styles.customMarker}>
              <MaterialCommunityIcons
                name="map-marker-account"
                size={60}
                color="black"
              />
            </View>
          </Marker>
        )}
        
        {/* Restaurants markers */}
        {restaurants.map((restaurant, index) => (
  <Marker
    key={index}
    coordinate={{
      latitude: restaurant.geometry.location.lat,
      longitude: restaurant.geometry.location.lng,
    }}
    title={restaurant.name}
    onPress={() => handleMarkerPress(restaurant.place_id, index)}
  >
    <RestaurantMarker rating={restaurant.rating ? restaurant.rating.toString() : 'N/A'} />
    <Callout tooltip style={styles.customCallout}>
      <View style={styles.calloutContainer}>
        <Text style={styles.calloutTitle}>{restaurant.name}</Text>
        {/* Additional information can be dynamically added here based on state updated by handleMarkerPress */}
        <Text style={styles.calloutText}>Rating: {restaurant.rating || 'N/A'}</Text>
        {/* You can conditionally render an Image component if a photo is available in the state */}
      </View>
    </Callout>
  </Marker>
))}
        
        {/* Origin and destination markers */}
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        
        {/* Directions */}
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
      
      {/* Search container */}
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
        {distance && duration ? (
          <View>
            <Text>Distance: {distance.toFixed(2)}</Text>
            <Text>Duration: {Math.ceil(duration)} min</Text>
          </View>
        ) : null}
      </View>
      
      {/* Center button */}
      <View>
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
          <MaterialCommunityIcons name="crosshairs" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
// RestaurantMarker component
const RestaurantMarker: FC<RestaurantMarkerProps> = ({ rating }) => {
  return (
    <View style={styles.markerContainer}>
      <View style={styles.bubble}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={16} color="white" />
        </View>
        <Text style={styles.rating}>{rating}</Text>
      </View>
      <View style={styles.pointer} />
    </View>
  );
};
// Styles
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
  centerButton: {
    position: "absolute",
    backgroundColor: "#ffffff", 
    height: 45,
    width: 45,
    borderRadius: 22.5, 
    bottom: 30,
    left: 140, 
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    elevation: 5, 
  },
  markerContainer: {
    alignItems: 'center',
  },
  bubble: {
    flexDirection: "row",
    backgroundColor: "rgba(100, 100, 100, 0.7)", 
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 20,
    alignItems: "center",
  },
  iconCircle: {
    backgroundColor: "black", 
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  rating: {
    color: "white",
    fontSize: 14,
  },
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 0,
    borderLeftWidth: 6,
    borderTopColor: "rgba(100, 100, 100, 0.7)", 
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    marginTop: -1,
  },
  customMarker: {
  },
  customCallout: {
    borderRadius: 6,
    padding: 10,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.3,
  },
  calloutContainer: {
    width: 180, // Adjust size as needed
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutText: {
    fontSize: 12,
  },
});
