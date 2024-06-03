import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Touchable,
  TouchableOpacity,
} from "react-native";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    text: "Welcome to Foodie Buddy!",
    image: require("@/assets/images/BuddyBod.png"),
  },
  {
    key: "2",
    text: "Filter eating spots to your heart’s content",
    image: require("@/assets/images/page-1.png"),
  },
  {
    key: "3",
    text: "Find eating spots on the map",
    image: require("@/assets/images/page-2.png"),
  },
  {
    key: "4",
    text: "Ask Buddy to provide eating spot recommendations",
    image: require("@/assets/images/page-3.png"),
  },
  {
    key: "5",
    text: "Add friends, make group chats, and invite Buddy",
    image: require("@/assets/images/page-4.png"),
  },
  {
    key: "6",
    text: "Choose personal preferences to get restaurant recommendations",
    image: require("@/assets/images/page-5.png"),
  },
];

interface Props {
  onClose: () => void;
}

const StartupGuide: React.FC<Props> = ({ onClose }) => (
  <View>
    <TouchableOpacity onPress={onClose}>
      <AntDesign name="closecircle" size={24} color="black" />
    </TouchableOpacity>

    <Swiper
      style={styles.wrapper}
      showsButtons={true}
      dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activeDot} />}
    >
      {slides.map((slide) => (
        <View style={styles.slide} key={slide.key}>
          <Image source={slide.image} style={styles.image} />
          <Text style={styles.text}>{slide.text}</Text>
        </View>
      ))}
    </Swiper>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: width - 60,
    height: "70%",
    resizeMode: "contain",
  },
  text: {
    color: "#000",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  dot: {
    backgroundColor: "rgba(0,0,0,.2)",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: "#FF6347",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
});

export default StartupGuide;
