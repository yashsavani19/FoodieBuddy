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
import SavedListItem from "@/components/SavedListItem";
import { Saved } from "@/model/Saved";
import TitleHeader from "@/components/TitleHeader";
import BackButton from "@/components/BackButton";

const VisitedSpotsView: React.FC = () => {
  // Access visitedRestaurants from AppContext using useContext hook
  const { visitedRestaurants } = useContext(AppContext);

  // Use useNavigation hook to access navigation object
  const navigation = useNavigation();

  // Function to render each item in the FlatList
  const renderItem = ({ item }: { item: Saved }) => (
    <SavedListItem item={item} listType="visited" />
  );

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <TitleHeader title="Visited" />
      <View style={styles.content}>
        {/* Back Button and Title */}
        <BackButton />
        {/* Rendered only if there are no visited spots */}
        {visitedRestaurants.length === 0 && (
          <View style={styles.noRestaurants}>
            <Text style={styles.titleText}>No visited spots</Text>
          </View>
        )}
        {/* FlatList to display visited restaurants */}
        <FlatList
          data={visitedRestaurants}
          keyExtractor={(item) => item.restaurant.id.toString()}
          renderItem={renderItem}
        />
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
    color: "white",
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
});

export default VisitedSpotsView;
