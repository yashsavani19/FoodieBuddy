import React, {useState} from "react";
import { StyleSheet, View, Text, Image, TextInput } from "react-native";
import Colors from "@/constants/Colors";
import SearchBar from "@/components/SearchBar";
import Categories from "@/components/Categories";
import Filters from "@/components/Filters";
import images from "@/assets/data/images";
import HeaderComponents from "./HeaderComponents";

// Add additional properties here if required
interface TitleHeaderProps {
  title?: string;
  searchBar?: boolean;
}

/**
 * Title header component for the app
 * @param param0 String title for the header
 * @returns Title header component
 */


export default function TitleHeader({ title, searchBar }: TitleHeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: images.logo }}
        style={styles.image}
      />
      <HeaderComponents title={title} searchBar={searchBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    height: 120,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: Colors.light.headerBackground,
  },
  title: {
    width: "70%",
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlignVertical: "center",
    margin: "auto",
    paddingHorizontal: "17%",
    paddingTop: 10,
  },
  image: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    marginLeft: 15,
    margin: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 10,
    paddingLeft: 10,
  },
});
