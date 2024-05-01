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

  return (
    <TouchableOpacity>
      <View style={styles.itemContainer}>
        <Image
          source={{
            uri: item.restaurant.image || images.defaultRestaurantImage,
          }}
          style={styles.image}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.spotName}>{item.restaurant.name}</Text>
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
  icon: {
    width: 27,
    aspectRatio: 1,
    resizeMode: "contain",
    marginLeft: 2,
  },
});
