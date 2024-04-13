import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppMappView from "@/components/AppMappView";
import TitleHeader from "@/components/TitleHeader";
import * as Location from 'expo-location';
import { UserLocationContext } from "./Context/UserLocationContext";

export default function Map() {
   const { location, setLocation } = useContext(UserLocationContext);
   
  return (
    <View style={styles.container}>
      <TitleHeader />
      <View style={styles.mapContainer}>
        <AppMappView />
      </View>
      <View style={styles.placeListContainer}>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    marginTop: 120, 
  },
  placeListContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    width: '100%'
  }
});
