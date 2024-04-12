import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewStyle from './../app/Utils/MapViewStyle.json'
import { UserLocationContext } from '@/app/(tabs)/Context/UserLocationContext'

export default function AppMappView() {
  const { location, setLocation} = useContext(UserLocationContext);
  return location?.latitude && (
    <View style={styles.container}>
      <MapView 
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      customMapStyle={MapViewStyle}
      region={{
        latitude:location?.latitude,
        longitude: location?.longitude,
        latitudeDelta: 0.0422,
        longitudeDelta:0.0421
      }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%'
  }
})