// RestaurantMarker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface RestaurantMarkerProps {
  rating: number | string; // Allow for either a number or a string to accommodate 'N/A' values
}

const RestaurantMarker: React.FC<RestaurantMarkerProps> = ({ rating }) => {
  return (
    <View style={styles.markerContainer}>
      <View style={styles.bubble}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={14} color="black" />
        </View>
        <Text style={styles.rating}>{rating}</Text>
      </View>
      <View style={styles.pointer} />
    </View>
  );
};

// Here we define the styles used by the RestaurantMarker component
const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  bubble: {
    flexDirection: "row",
    backgroundColor: "#585f6e", 
    paddingLeft: 3,
    paddingRight: 5,
    paddingVertical: 2,
    borderRadius: 20,
    alignItems: "center",
  },
  iconCircle: {
    backgroundColor: '#e46860', // Red background for the icon circle
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  rating: {
    color: "white",
    fontSize: 12,
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
    borderTopColor: "#585f6e", 
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    marginTop: -1,
  },
});

export default RestaurantMarker;
