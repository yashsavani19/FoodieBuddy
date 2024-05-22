import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "@/context/AppContext";
import FoodPreferencesListItem from "@/components/FoodPreferenceListItem";
import { Saved } from "@/model/Saved";
import TitleHeader from "@/components/TitleHeader";
import BackButton from "@/components/BackButton";
import { PreferenceList } from "@/model/PreferenceList";
import { Preference } from "@/model/Preference";

const FavouriteSpotsView: React.FC = () => {

  // Get favourite restaurants from context
  const { preferences } = useContext(AppContext);

  const preference = preferences.preferences;

  // Get navigation object
  const navigation = useNavigation(); 

  // Render each saved item
  const renderItem = ({ item }: { item: Preference }) => (
    <FoodPreferencesListItem preference={item}  /> 
  );

  return (
    <View style={styles.container}>
      {/* Display title header */}
      <TitleHeader title="Food Preferences"/>
      <View style={styles.content}>
        {/* Back Button and Title */}
        <BackButton />
        {/* Display message if no favourite restaurants */}
        {preference.length === 0 && (
          <View style={styles.noRestaurants}>
            <Text style={styles.titleText}>No Food Preferences</Text>
          </View>
        )}
        {/* FlatList to display favourite restaurants */}
        <View style={styles.listContainer}>
          <FlatList
            data={preferences.preferences}
            renderItem={renderItem}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    marginTop: 120,
  },
  header: {
    height: 40, 
    backgroundColor: "black", 
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerContent: {
    height: 40, 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10, 
  },
  backButton: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1, 
    textAlign: "center", 
    color: 'white'
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
  noRestaurants: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    color: "#888",
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
  },
});

export default FavouriteSpotsView;

