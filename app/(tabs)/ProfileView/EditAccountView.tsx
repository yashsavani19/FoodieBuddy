import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Animated,
  Text,
} from "react-native";
import React, { useContext, useEffect, useRef } from "react";
import TitleHeader from "@/components/TitleHeader";
import { AppContext } from "@/context/AppContext";
import { changeEmail, changeUsername, useAuth } from "@/context/AuthContext";
import BackButton from "@/components/BackButton";
import TitleButton from "@/components/EditAccountComponents/TitleButton";
import EditTextField from "@/components/EditAccountComponents/EditTextField";
import BaseModal from "@/components/modals/BaseModal";
import BaseButton from "@/components/modals/BaseButton";
import { updateEmail } from "firebase/auth";

const EditAccountView: React.FC = () => {
  const { userObject } = useContext(AppContext);
  const { user } = useAuth();
  const [newUsername, setNewUsername] = React.useState(user?.displayName || "");
  const [showUsername, setShowUsername] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState(user?.email || "");
  const [showEmail, setShowEmail] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [viewModal, setViewModal] = React.useState(false);

  const handleUpdateUsername = () => {
    if (newUsername === "") return;
    if (newUsername === user?.displayName) return;
    console.log(`New username: ${newUsername}`);
    changeUsername(newUsername);
  };

  const handleUpdateEmail = () => {
    if (newEmail === "") return;
    if (newEmail === user?.email) return;
    console.log(`New email: ${newEmail}`);

    setViewModal(true);
    changeEmail(newEmail);
  };

  const handleUpdatePassword = () => {
    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      alert("Please fill out all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log(`Old password: ${oldPassword}`);
    console.log(`New password: ${newPassword}`);
  };

  const handleEditUsername = (newMode: boolean) => {
    setShowUsername(newMode);
    if (newMode) {
      setShowEmail(false);
      setNewEmail(user?.email || "");
      setShowPassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setNewUsername(user?.displayName || "");
    }
  };

  const handleEditEmail = (newMode: boolean) => {
    setShowEmail(newMode);
    if (newMode) {
      setShowUsername(false);
      setNewUsername(user?.displayName || "");
      setShowPassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setNewEmail(user?.email || "");
    }
  };

  const handleEditPassword = (newMode: boolean) => {
    setShowPassword(newMode);
    if (newMode) {
      setShowUsername(false);
      setNewUsername(user?.displayName || "");
      setShowEmail(false);
      setNewEmail(user?.email || "");
    } else {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <View style={styles.container}>
      <TitleHeader title="Edit Account" />
      <View style={styles.content}>
        <BackButton />
        <View style={{ marginTop: 30, marginVertical: 10 }}>
          <TitleButton
            title={"Change Username"}
            onEdit={handleEditUsername}
            onPress={() => setShowUsername(false)}
            mode={showUsername}
          />
          <EditTextField
            title={newUsername || ""}
            isVisible={showUsername}
            enableButton={user?.displayName !== newUsername}
            onSubmit={setNewUsername}
            onUpdatePress={handleUpdateUsername}
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <TitleButton
            title={"Change Email Address"}
            onEdit={handleEditEmail}
            onPress={() => setShowEmail(false)}
            mode={showEmail}
          />
          <EditTextField
            title={newEmail || ""}
            isVisible={showEmail}
            enableButton={user?.email !== newEmail}
            onSubmit={setNewEmail}
            onUpdatePress={handleUpdateEmail}
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <TitleButton
            title={"Change Password"}
            onEdit={handleEditPassword}
            onPress={() => setShowPassword(false)}
            mode={showPassword}
          />
          <View>
            <View>
              <EditTextField
                title={oldPassword || ""}
                isVisible={showPassword}
                onSubmit={setOldPassword}
                placeholder="Enter old password"
                isSecure={true}
              />
            </View>
            <View>
              <EditTextField
                title={newPassword || ""}
                isVisible={showPassword}
                onSubmit={setNewPassword}
                placeholder="Enter new password"
                isSecure={true}
              />
            </View>
            <View>
              <EditTextField
                title={confirmPassword || ""}
                isVisible={showPassword}
                onSubmit={setConfirmPassword}
                placeholder="Confirm new password"
                isSecure={true}
                enableButton={
                  oldPassword !== "" &&
                  newPassword !== "" &&
                  confirmPassword !== ""
                }
                onUpdatePress={handleUpdatePassword}
              />
            </View>
          </View>
        </View>
        <View style={{ margin: 20 }}>
          <Button
            title={"Delete account placeholder"}
            onPress={() => {
              setViewModal(true);
            }}
          />
        </View>
      </View>
      <BaseModal
        title={"Verify New Email Address"}
        bodyText={"A verification email has been sent to your new email address. Please verify your email address to complete the change."}
        visible={viewModal}
        onClose={() => {
          setViewModal(false);
        }}
        buttons={[button1]}
      />
    </View>
  );
};

const button1 = (
  <BaseButton
    title={"I Promise"}
    onPress={() => {
      console.log("I promise I'll verify my email");
    }}
    buttonColour={"#3464ac"}
  />
);

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
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 20,
  },
});
