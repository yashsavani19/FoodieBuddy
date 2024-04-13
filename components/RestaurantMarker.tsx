import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface RestaurantMarkerProps {
  rating: number | string;
}

const RestaurantMarker: React.FC<RestaurantMarkerProps> = ({ rating }) => {
  const [pressed, setPressed] = useState(false);

  // Define styles that change when the marker is pressed
  const bubbleStyle = pressed ? styles.bubblePressed : styles.bubble;
  const iconCircleStyle = pressed ? styles.iconCirclePressed : styles.iconCircle;
  const pointerStyle = pressed ? styles.pointerPressed : styles.pointer;

  return (
    <TouchableOpacity onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
      <View style={styles.markerContainer}>
        <View style={bubbleStyle}>
          <View style={iconCircleStyle}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={14} color={pressed ? "#e46860" : "black"} />
          </View>
          <Text style={styles.rating}>{rating}</Text>
        </View>
        <View style={pointerStyle} />
      </View>
    </TouchableOpacity>
  );
};

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
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconCircle: {
    backgroundColor: '#e46860',
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
  bubblePressed: {
    flexDirection: "row",
    backgroundColor: "#e46860", 
    paddingLeft: 3,
    paddingRight: 5,
    paddingVertical: 2,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconCirclePressed: {
    backgroundColor: 'white', 
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  pointerPressed: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 0,
    borderLeftWidth: 6,
    borderTopColor: "#e46860", 
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    marginTop: -1,
  },
});

export default RestaurantMarker;
