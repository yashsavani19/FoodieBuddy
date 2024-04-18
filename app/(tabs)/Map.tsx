import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppMappView from "@/components/AppMappView";
import TitleHeader from "@/components/TitleHeader";
import * as Location from 'expo-location';
import { AppContext } from "@/model/AppContext";

export default function Map() {
  const { location } = useContext(AppContext);

   // React components should check for the existence of context data before rendering dependent components
   if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading location data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TitleHeader searchBar/>
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
