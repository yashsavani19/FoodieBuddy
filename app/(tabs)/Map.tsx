import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppMappView from "@/components/AppMappView";
import TitleHeader from "@/components/TitleHeader";
import * as Location from 'expo-location';
import { LocationObject } from "expo-location";

export default function Map() {
   const [location, setLocation] = useState<LocationObject | null>(null);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
    })();
  }, []);

  let text = 'Waiting for location...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <TitleHeader />
      <View style={styles.mapContainer}>
        <AppMappView />
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
});
