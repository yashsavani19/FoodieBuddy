import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import SavedListItem from "../SavedListItem";
import { Saved } from "@/model/Saved";

interface SavedListProps {
  restaurants: any;
  type: "visited" | "favourite" | "bookmarked";
}

const SavedList: React.FC<SavedListProps> = ({ restaurants, type }) => {
  const renderItem = ({ item }: { item: Saved }) => (
    <SavedListItem item={item} listType={type} />
  );
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.restaurant.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default SavedList;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});
