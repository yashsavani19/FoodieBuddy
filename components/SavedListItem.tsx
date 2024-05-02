import images from "@/assets/data/images";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { Restaurant } from "@/model/Restaurant";
import {
  removeBookmark,
  removeFavourite,
  removeVisited,
} from "@/controller/DatabaseHandler";
import { Saved } from "@/model/Saved";
import { AppContext } from "@/context/AppContext";
import { useContext } from "react";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
import RestaurantListItem from "./RestaurantListItem";

interface SavedListItemProps {
  item: Saved;
  listType: "visited" | "favourite" | "bookmarked";
}

const SavedListItem: React.FC<SavedListItemProps> = ({ item, listType }) => {
  const {
    removeFavouriteContext,
    removeBookmarkContext,
    removeVisitedContext,
  } = useContext(AppContext);
  const handleListButtonPress = () => {
    switch (listType) {
      case "visited":
        removeVisitedContext(item.restaurant.id);
        break;
      case "favourite":
        removeFavouriteContext(item.restaurant.id);
        break;
      case "bookmarked":
        removeBookmarkContext(item.restaurant.id);
        break;
      default:
        break;
    }
  };

  const listIcon =
    listType === "visited"
      ? images.visitedSelectedIcon
      : listType === "favourite"
      ? images.faveSelectedIcon
      : images.bookmarkSelectedIcon;

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
  return (
    <TouchableOpacity onPress={() => {
        navigation.navigate("DetailsView", { Restaurant: item.restaurant });
      }}>
      <View style={{ ...styles.itemContainer, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{
              uri: item.restaurant.image || images.defaultRestaurantImage,
            }}
            style={{ ...styles.image, marginRight: 10 }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.spotName}>{item.restaurant.name}</Text>
        </View>
        
        <View style={{ marginLeft: 'auto' }}>
          <Pressable onPress={handleListButtonPress}>
            <Image
              source={{
                uri: listIcon,
              }}
              style={styles.icon}
            />
          </Pressable>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SavedListItem;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingRight: 4,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  icon: {
    width: 27,
    aspectRatio: 1,
    resizeMode: "contain",
    marginLeft: 2,
  },
});
