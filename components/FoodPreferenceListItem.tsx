import { Preference } from "@/model/Preference";
import images from "@/assets/data/images";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { Saved } from "@/model/Saved";
import { AppContext } from "@/context/AppContext";
import { useContext } from "react";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
interface FoodPreferencesListItemProps {
  preference: Preference;
}

const FoodPreferencesListItem: React.FC<FoodPreferencesListItemProps> = ({ preference }) => {
  return (
    <View>
      <Text>{preference.name}</Text>
    </View>
  );
};

export default FoodPreferencesListItem;
