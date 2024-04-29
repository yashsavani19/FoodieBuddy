import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, GestureResponderEvent } from 'react-native';
import TitleHeader from "@/components/TitleHeader";
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';

export default function UserProfileView() {
  const navigation = useNavigation(); // Use navigation hook here
  const username = "Param Patel";
  
  const menuItems = [
    
    { name: '  Bookmarked Spots'},
    { name: 'Visited Spots'}
  ];


  function navigateToFavouriteSpots(event: GestureResponderEvent): void {
    // Assuming 'navigation' is already defined using the useNavigation hook
    navigation.navigate('FavoriteSpotsView');
  }

  function navigateToBookmarkedSpots(event: GestureResponderEvent): void {
    // Assuming 'navigation' is already defined using the useNavigation hook
    navigation.navigate('BookmarkedSpotsView');
  }
  
  function navigateToVisitedSpots(event: GestureResponderEvent): void {
    // Assuming 'navigation' is already defined using the useNavigation hook
    navigation.navigate('VisitedSpotsView');
  }

  return (
    <View style={styles.container}>
      <TitleHeader title="Profile" />
      <ScrollView style={styles.scrollView}>
      <View style={styles.profileSection}>
          <View style={styles.profilePictureWrapper}>
            <Image
              source={require('@/assets/images/user-icon.png')} // Correct image path
              style={styles.profilePicture}
            />
          </View>
          <Text style={styles.username}>{username}</Text>
          <View style={styles.accountActions}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={{fontSize:20}}>Edit Account</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{fontSize:20}}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuItemsSection}>
          <TouchableOpacity onPress={navigateToFavouriteSpots} style={styles.menuItem}>
            <FontAwesome name="heart" size={35} color="red" />
            <Text style={styles.menuItemText}>Favorite Spots</Text>
            <AntDesign name="right" style={styles.rightArrow} />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToBookmarkedSpots} style={styles.menuItem}>
            <FontAwesome name="bookmark" size={35} color="orange" />
            <Text style={styles.menuItemText}>Bookmarked Spots</Text>
            <AntDesign name="right" style={styles.rightArrow} />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToVisitedSpots} style={styles.menuItem}>
            <MaterialIcons name="add-location-alt" size={35} color="green" />
            <Text style={styles.menuItemText}>Visited Spots</Text>
            <AntDesign name="right" style={styles.rightArrow} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  rightArrow: {
  position: 'absolute',
  right: 20,
  fontSize: 35,
  color: '#ededed', 
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    marginTop: 120,
  },
  
  profileSection: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  profilePictureWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,

  },
  username: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  editButton: {
    fontSize: 25,
    marginRight: 20,
  },
  menuItemsSection: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
    marginVertical: 10,
    paddingVertical: 15,
    padding: 20,
    backgroundColor: '#363232',
    fontSize: 10,
    borderRadius: 20,
    
  },
  editAccountText: {
    fontSize: 15, // Font size for Edit Account
    color: '#000', // Black text
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 19,
    color: '#ededed',
  },
});


