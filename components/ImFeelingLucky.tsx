import { Pressable, StyleSheet, Text, Touchable, View } from "react-native";
import React, { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useNavigation } from "expo-router";
import { RootStackParamList } from "@/constants/navigationTypes";
import { NavigationProp } from "@react-navigation/native";

// props: children components
// return: Pressable component
interface ImFeelingLuckyProps {
  children: React.ReactNode;
}

const ImFeelingLucky: React.FC<ImFeelingLuckyProps> = ({ children }) => {
  const { localRestaurants } = useContext(AppContext);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * localRestaurants.length);
  };

  const handleRandom = () => {
    const randomIndex = generateRandomNumber();
    console.log(`Random index: ${randomIndex}`);
    console.log(`Random restaurant: ${localRestaurants[randomIndex].name}`);
    navigation.navigate("DetailsView", {
      Restaurant: localRestaurants[randomIndex],
    });
  };

  return (
    <View>
      <Pressable testID="lucky-button" onPress={handleRandom}>{children}</Pressable>
    </View>
  );
};

export default ImFeelingLucky;

const styles = StyleSheet.create({});
