import { useEffect , useContext} from "react";
import { StyleSheet, View } from "react-native";
import AppMappView from "@/components/AppMappView";
import TitleHeader from "@/components/TitleHeader";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AppContext } from "@/context/AppContext";
import {
  MapRouteParams,
  RootStackParamList,
} from "@/constants/navigationTypes";
import MapView from "react-native-maps";
import { Category } from "@/model/Category";

export default function Map() {
  const route = useRoute<RouteProp<RootStackParamList, "Map">>();
  const { geometry } = route.params || {};
  const { setSelectedCategory, selectedCategory, searchTerm, setSearchTerm } = useContext(AppContext);

  useEffect(() => { 
    console.log(searchTerm)
  },[searchTerm]) 

  return (
    <View style={styles.container}>
      <TitleHeader 
        searchBar={true} 
        onSearchSubmit={setSearchTerm}
        onCategorySelect={setSelectedCategory}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
      />
      <View style={styles.mapContainer}>
        <AppMappView 
          geometry={geometry} 
        />
      </View>
      <View style={styles.placeListContainer}></View>
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
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    width: "100%",
  },
});
