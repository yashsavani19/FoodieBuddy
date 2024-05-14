import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import React, { useContext } from "react";
import TitleHeader from "@/components/TitleHeader";
import { User } from "@/model/User";
import { AppContext } from "@/context/AppContext";
import { changeEmail, changeUsername, useAuth } from "@/context/AuthContext";
import BackButton from "@/components/BackButton";
import EditTextField from "@/components/EditAccountComponents/EditTextField";

const EditAccountView: React.FC = () => {
  const { userObject } = useContext(AppContext);
  const { user } = useAuth();

  const updateUsername = (newUsername: string) => {
    console.log(`New username: ${newUsername}`);
    changeUsername(newUsername);
  }

  const updateEmail = (newEmail: string) => {
    console.log(`New email: ${newEmail}`);
    changeEmail(newEmail);
  }

  return (
    <View style={styles.container}>
      <TitleHeader title="Edit Account" />
      <View style={styles.content}>
        <BackButton />
        <EditTextField
          title={user?.displayName || "Username"}
          onSubmit={updateUsername}
        />
        <EditTextField
          title={user?.email || "Email Address"}
          onSubmit={updateEmail}
        />
        <EditTextField title={"Current Password"} onSubmit={() => {}} />
        <EditTextField title={"New Password"} onSubmit={() => {}} />
        <EditTextField title={"Confirm New Password"} onSubmit={() => {}} />
        <View style={{ margin: 20 }}>
          <Button title={"Delete account placeholder"} />
        </View>
      </View>
    </View>
  );
};

export default EditAccountView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    marginTop: 120,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});
