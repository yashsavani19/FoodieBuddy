import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigationTypes";
import { RouteProp } from "@react-navigation/native";
import DetailsViewComponents from "@/components/DetailsViewComponents";
import { useNavigation } from "expo-router";

// Define the type for the route prop
type DetailsViewRouteProp = RouteProp<RootStackParamList, "DetailsView">;

export default function DetailsView() {

  // Access navigation object for navigating back
  const navigation = useNavigation();

  // Function to navigate back
  function backFunction() {
    navigation.goBack();
  }

  // Retrieve the route object
  const route = useRoute<DetailsViewRouteProp>();
  // Extract the restaurant object from route.params
  const { Restaurant } = route.params;

  // Use the restaurant object directly in your JSX
  if (!Restaurant) {
    return (
      <View style={styles.centered}>
        <Text>Restaurant not found.</Text>
      </View>
    );
  }

  // Render the DetailsViewComponents with the restaurant object
  return (
    <DetailsViewComponents
      restaurant={Restaurant}
      backFunction={backFunction}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  backButton: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
