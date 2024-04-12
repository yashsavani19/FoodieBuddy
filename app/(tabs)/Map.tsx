import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppMappView from "@/components/AppMappView";
import TitleHeader from "@/components/TitleHeader";
import * as Location from 'expo-location';
import { UserLocationContext } from "./Context/UserLocationContext";
import GlobalApis from "../Utils/GlobalApis";

export default function Map() {
   const { location, setLocation } = useContext(UserLocationContext);
  const [placeList, setPlaceList]=useState([]);

  useEffect(() => {
    location && GetNearByPlace();
  },[location])
  const GetNearByPlace=()=>{
  const data = {
    "includedTypes": ["restaurant"],
    "maxResultCount": 10,
    "locationRestriction": {
      "circle": {
        "center": {
          "latitude": location?.latitude,
          "longitude": location?.longitude
        },
        "radius": 5000.0
      }
    }
  }
  GlobalApis.NewNearByPlaces(data).then(resp=>{
    console.log(JSON.stringify(resp.data));
    setPlaceList(resp.data?.places);
  })
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
