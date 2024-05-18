import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  SafeAreaView,
  Keyboard,
  Animated,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useRef } from "react";
import TitleHeader from "@/components/TitleHeader";
import { AppContext } from "@/context/AppContext";
import {
  changeEmail,
  changePassword,
  changeUsername,
  reSignIn,
  useAuth,
} from "@/context/AuthContext";
import BackButton from "@/components/BackButton";
import TitleButton from "@/components/EditAccountComponents/TitleButton";
import EditTextField from "@/components/EditAccountComponents/EditTextField";
import BaseModal from "@/components/modals/BaseModal";
import BaseButton from "@/components/modals/BaseButton";

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
  const [viewEmailModal, setEmailViewModal] = React.useState(false);
  const [viewUsernameModal, setUsernameViewModal] = React.useState(false);
  const [viewPasswordModal, setPasswordViewModal] = React.useState(false);
  const [showDeleteButton, setShowDeleteButton] = React.useState(true);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setShowDeleteButton(false);
    });
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setShowDeleteButton(true);
    });

    return () => {
      keyboardHideListener.remove();
      keyboardShowListener.remove();
    };
  }, []);

  const handleUpdateUsername = async () => {
    if (newUsername === "") return;
    if (newUsername === user?.displayName) return;
    console.log(`New username: ${newUsername}`);
    await changeUsername(newUsername);
    // alert("Username updated successfully");
    setUsernameViewModal(true);
  };

  const handleUpdateEmail = async () => {
    if (newEmail === "") return;
    if (newEmail === user?.email) return;
    console.log(`New email: ${newEmail}`);

    const authenticated = await reSignIn(oldPassword);
    if (authenticated) {
      const result = await changeEmail(newEmail);
      if (result) setEmailViewModal(true);
    }
  };

  const handleUpdatePassword = async () => {
    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      alert("Please fill out all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const authenticated = await reSignIn(oldPassword);
    if (authenticated) {
      await changePassword(newPassword);
      // alert("Password updated successfully");
      setPasswordViewModal(true);
    }
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

  const button1 = (
    <BaseButton
      title={"I Promise"}
      onPress={() => {
        console.log("I promise I'll verify my email");
        setShowEmail(false);
        setEmailViewModal(false);
      }}
      buttonColour={"#3464ac"}
    />
  );

  const button2 = (
    <BaseButton
      title={"Thanks"}
      onPress={() => {
        console.log("Thanks pressed");
        setShowUsername(false);
        setUsernameViewModal(false);
      }}
      buttonColour={"#3464ac"}
    />
  );

  const button3 = (
    <BaseButton
      title={"OK"}
      onPress={() => {
        console.log("OK pressed");
        setShowPassword(false);
        setPasswordViewModal(false);
      }}
      buttonColour={"#cc4343"}
    />
  );

  return (
    <View style={styles.container}>
      <TitleHeader title="Edit Account" />
      <View style={styles.content}>
        <BackButton />
        <ScrollView style={styles.topContainer}>
          <SafeAreaView>
            <View style={{}}>
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
                  imageSrc="username"
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
                  title={oldPassword || ""}
                  isVisible={showEmail}
                  onSubmit={setOldPassword}
                  placeholder="Enter password"
                  imageSrc="password"
                  isSecure={true}
                />
                <EditTextField
                  title={newEmail || ""}
                  isVisible={showEmail}
                  enableButton={user?.email !== newEmail}
                  onSubmit={setNewEmail}
                  imageSrc="email"
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
                      imageSrc="password"
                      isSecure={true}
                    />
                  </View>
                  <View>
                    <EditTextField
                      title={newPassword || ""}
                      isVisible={showPassword}
                      onSubmit={setNewPassword}
                      placeholder="Enter new password"
                      imageSrc="password"
                      isSecure={true}
                    />
                  </View>
                  <View>
                    <EditTextField
                      title={confirmPassword || ""}
                      isVisible={showPassword}
                      onSubmit={setConfirmPassword}
                      placeholder="Confirm new password"
                      imageSrc="password"
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
            </View>
          </SafeAreaView>
        </ScrollView>
        {showDeleteButton && (
          <TouchableOpacity
            onPress={() => {
              alert("Delete account pressed");
            }}
            style={styles.deleteButton}
          >
            <Text
              style={{ color: "white", textAlign: "center", fontWeight: "600" }}
            >
              Delete Account
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <BaseModal
        title={"Verify New Email Address"}
        bodyText={
          "A verification email has been sent to your new email address. Please verify your email address to complete the change."
        }
        visible={viewEmailModal}
        onClose={() => {
          setEmailViewModal(false);
        }}
        buttons={[button1]}
      />
      <BaseModal
        title={"Username Updated Successfully"}
        visible={viewUsernameModal}
        onClose={() => {
          setUsernameViewModal(false);
        }}
        buttons={[button2]}
      />
      <BaseModal
        title={"Password Updated Successfully"}
        bodyText="Please remember to use your new password to log in next time."
        visible={viewPasswordModal}
        onClose={() => {
          setPasswordViewModal(false);
        }}
        buttons={[button3]}
      />
    </View>
  );
};

export default EditAccountView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  topContainer: {
    flex: 1,
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
  deleteButton: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#cc4343",
    borderRadius: 12,
    margin: 40,
    width: 150,
    height: 40,
  },
});
