import { StyleSheet, Button, View } from "react-native";
import Share from "react-native-share";

// Still TBC
/**
 * TODO: ShareHandler component to share message, url and title
 */
export default function ShareHandler() {
  const options = {
    message: "This is a test message",
    url: "http://bam.tech",
    title: "Share via",
  };

  const onShare = async (myOptions = options) => {
    try {
      const result = await Share.open(myOptions);
      console.log(result);
    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Share"
        onPress={async () => {
          await onShare();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
