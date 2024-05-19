import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";

interface ProfileFriendsNavBarProps {
  mode: "profile" | "friends";
}

const ProfileFriendsNavBar: React.FC<ProfileFriendsNavBarProps> = ({
  mode,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        disabled={mode === "profile"}
        onPress={() => {
          navigation.navigate("UserProfileView");
        }}
      >
        <Text style={styles.text}>Profile</Text>
        <View
          style={[
            styles.underline,
            { backgroundColor: mode === "profile" ? "#F26722" : "#00000000" },
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} disabled={mode === "friends"} onPress={() => {
          navigation.navigate("FriendsView");
        }}>
        <Text style={styles.text}>Friends</Text>
        <View
          style={[
            styles.underline,
            { backgroundColor: mode === "friends" ? "#F26722" : "#00000000" },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileFriendsNavBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#363232",
    height: 40,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    flexDirection: "column",
    alignItems: "center",
  },
  underline: {
    height: 5,
    backgroundColor: "#F26722",
    width: 100,
    marginBottom: -10,
    borderRadius: 2,
    marginTop: 3,
  },
});
