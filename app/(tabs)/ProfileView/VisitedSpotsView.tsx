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
import { Restaurant } from "@/model/Restaurant";
import { AppContext } from "@/context/AppContext";
import SavedListItem from "@/components/SavedListItem";
import { Saved } from "@/model/Saved";

const VisitedSpotsView: React.FC = () => {
  const { visitedRestaurants } = useContext(AppContext);
  const { visitedRestaurants } = useContext(AppContext);
  const navigation = useNavigation();
  const renderItem = ({ item }: { item: Saved }) => (
    <SavedListItem item={item} listType="visited" />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Visited Spots</Text>
      </View>
      <FlatList
        data={visitedRestaurants}
        keyExtractor={(item) => item.restaurant.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomColor: "#ddd",
  },
  backButton: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontWeight: "bold",
    flex: 1, // added for title alignment
    textAlign: "center", // align the title
    textAlign: "center", // align the title
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
});

export default VisitedSpotsView;
