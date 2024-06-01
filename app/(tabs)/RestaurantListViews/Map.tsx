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
import DrawerWrapper from "@/components/FilterDrawerComponents/FilterDrawerWrapper";
import Constants from "expo-constants";

export default function Map() {
  const route = useRoute<RouteProp<RootStackParamList, "Map">>();
  const { geometry } = route.params || {};
  const { searchTerm, setSearchTerm } = useContext(AppContext);

  return (
    <DrawerWrapper>
      <View style={styles.container}>
        <TitleHeader 
          searchBar={true} 
          onSearchSubmit={setSearchTerm}
          searchTerm={searchTerm}
        />
        <View style={styles.mapContainer}>
          <AppMappView 
            geometry={geometry} 
          />
        </View>
        <View style={styles.placeListContainer}></View>
      </View>
    </DrawerWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    marginTop: Constants.statusBarHeight + 100,
  },
  placeListContainer: {
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    width: "100%",
  },
});
