import { Restaurant } from "@/model/Restaurant";
import { StyleSheet, Image, Pressable } from 'react-native';
import { Text, View } from './Themed';
import images from "@/assets/data/images";

type RestaurantListItemProps = {
  restaurant: Restaurant; 
};

const RestaurantListItem = ({ restaurant }: RestaurantListItemProps) => {
  return (
    <Pressable style={styles.container}> 
      <Image 
        source={{ uri: restaurant.image || images.defaultRestaurantImage }} 
        style={styles.image} 
        resizeMode='cover'
      />
      <View style={styles.textContainer}>
        <View style={styles.iconContainer}>
          <Image 
            source={{ uri: images.mapMarker }} 
            style={styles.mapIcon} 
          />
          <Text style={styles.findOnMap}>Find on map</Text>
        </View>
        <View style={styles.textInfo}>
          <Text style={styles.title}>{restaurant.name}</Text>
          <Text style={styles.distance}>{restaurant.distance.toFixed(1)}km</Text>
        </View>

        <View style={styles.iconContainer}>
          <Image 
            source={{ uri: images.bookmarkIcon }} 
            style={styles.icon} 
          />
        </View>

        <View style={styles.iconContainer}>
          <Image 
            source={{ uri: images.faveIcon }} 
            style={styles.icon} 
          />
        </View>

      </View>
    </Pressable>
  );
};

export default RestaurantListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
    //borderRadius: 10,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingRight: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  distance: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  findOnMap: {
    fontWeight: 'bold',
    textAlignVertical: 'center',
    width: 50, 
    marginRight: 8,
    textAlign: 'left',
  },
  image: {
    width: '100%',
    aspectRatio: 2.5/1,
    borderRadius: 10,
  },
  icon: {
    width: 30,
    aspectRatio: 1,
    resizeMode: "contain",
  },
  mapIcon: {
    width: 35,
    aspectRatio: 1,
    resizeMode: "contain",
  }
});
