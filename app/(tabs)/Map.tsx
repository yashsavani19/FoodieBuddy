import { useState, useEffect} from "react";
import { StyleSheet, Text, View } from "react-native";
import AppMappView from "@/components/AppMappView";
import TitleHeader from "@/components/TitleHeader";
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppContext } from '@/context/AppContext';
import { MapRouteParams, RootStackParamList } from "@/constants/navigationTypes";
import MapView from 'react-native-maps';

export default function Map() {
  const route = useRoute<RouteProp<RootStackParamList, 'Map'>>();
  const { geometry } = route.params || {};

  const [searchTerm, setSearchTerm] = useState<string>('');
  useEffect(() => { 
    console.log(searchTerm)
  },[searchTerm]) 

  return (
    <View style={styles.container}>
      <TitleHeader searchBar={true} onSearchSubmit={setSearchTerm}/>
      <View style={styles.mapContainer}>
        <AppMappView geometry={geometry} searchTerm={searchTerm}/>
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
