import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface BookmarkedSpot {
  id: number;
  name: string;
  image: string;
}

const bookmarkedSpots: BookmarkedSpot[] = [
  { id: 1, name: 'Amazing Coffee House', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Cozy Noodle Corner', image: 'https://via.placeholder.com/150' },
]; 

const BookmarkedSpotsView: React.FC = () => {
    const navigation = useNavigation();
    const renderItem = ({ item }: { item: BookmarkedSpot }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.spotName}>{item.name}</Text>
    </View>
  );

return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Bookmarked Spots</Text>
        </View>
        <FlatList
            data={bookmarkedSpots}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
        />
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    backButton: {
      paddingHorizontal: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
    },
    spotName: {
      fontSize: 18,
    },
  });

export default BookmarkedSpotsView;
