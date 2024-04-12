import Filters from "./Filters";
import Categories from "./Categories";
import SearchBar from "./SearchBar";
import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

interface HeaderComponentsProps {
  title?: string;
  searchBar?: boolean;
}

export default function HeaderComponents({
  title,
  searchBar,
}: HeaderComponentsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  if (title) {
    return <Text style={styles.title}>{title}</Text>;
  }
  if (searchBar) {
    return (
        <View style={styles.container}>
            <SearchBar />
            <View style={styles.filters}>
                <Categories />
                <Filters />
            </View>
        </View>
        );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    marginTop:15,
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
    margin: 20,
    marginTop: 15,
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
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10,
  }
});
