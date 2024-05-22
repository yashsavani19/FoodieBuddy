import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import TitleHeader from "@/components/TitleHeader";
import ProfileFriendsNavBar from "@/components/ProfileFriendsNavBar";
import { Friend } from "@/model/Friend";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";

interface FriendProfileProps {
  friend: Friend;
}

const FriendProfile: React.FC<FriendProfileProps> = ({ friend }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    console.log("FriendProfile: ", friend);
  }, [friend]);

  return (
    <View style={styles.container}>
      <TitleHeader title="Friends" />
      <ScrollView style={styles.scrollView}>
        <ProfileFriendsNavBar mode="friends" />
        <View style={{ borderBottomWidth: 3, borderBottomColor: "#363232" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="arrowleft" style={styles.backArrow} />
          </TouchableOpacity>
        </View>
        <View>
          <Text>Friend profile</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default FriendProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    marginTop: 120,
  },
  backArrow: {
    fontSize: 35,
    color: "#363232",
    padding: 10,
  },
});
