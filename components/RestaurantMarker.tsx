import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface RestaurantMarkerProps {
  rating: number | string;
  price: number | string;
  selected: boolean;
}

const RestaurantMarker: React.FC<RestaurantMarkerProps> = ({ rating, selected }) => {
  const bubbleStyle = selected ? styles.bubbleSelected : styles.bubble;
  const iconCircleStyle = selected ? styles.iconCircleSelected : styles.iconCircle;
  const pointerStyle = selected ? styles.pointerSelected : styles.pointer;
  
  return (
    <View style={styles.markerContainer}>
      <View style={bubbleStyle}>
        <View style={iconCircleStyle}>
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={14}
            color={selected ? "#e46860" : "black"} 
          />
        </View>
        <Text style={styles.rating}>{rating}</Text>
      </View>
      <View style={pointerStyle} />
    </View>
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
  bubbleSelected: {
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
  iconCircleSelected: {
    backgroundColor: 'white', 
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  pointerSelected: {
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
