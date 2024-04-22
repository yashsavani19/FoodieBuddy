import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import TitleHeader from "@/components/TitleHeader";
import images from '@/assets/data/images';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';

export default function UserProfileView() {
  const username = "Param Patel"; // Example username
  const menuItems = [
    { name: 'Favorite Eating Spots', icon: 'heart', iconType: 'AntDesign' },
    { name: 'Bookmarked Eating Spots', icon: 'bookmark', iconType: 'FontAwesome5' },
    { name: 'Visited Eating Spots', icon: 'map-marker-alt', iconType: 'FontAwesome5' }
  ];


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
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              {item.iconType === 'AntDesign' ? (
                <AntDesign name={item.icon} size={30} color="black" />
              ) : (
                <FontAwesome5 name={item.icon} size={30} color="black" />
              )}
              <Text style={styles.menuItemText}>{item.name}</Text>
            </TouchableOpacity>
            
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 50, // Circular shape
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    paddingLeft: 20,
  },
  editAccountText: {
    fontSize: 15, // Font size for Edit Account
    color: '#000', // Black text
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 25,
  },
});


