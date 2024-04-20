import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import images from "@/assets/data/images";
import colors from "@/constants/Colors";

export default function Loading() {
  return (
    <View style={styles.container}>
      <Image source={{ uri: images.logo }} style={styles.image} />
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.headerBackground,
    justifyContent: "center",

  },
  image: {
    height: 150,
    resizeMode: "contain",
    margin: 50,
  },
});
