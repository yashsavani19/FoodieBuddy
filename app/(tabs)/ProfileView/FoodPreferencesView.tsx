// import React from "react";
// import { View, FlatList, StyleSheet, Image, Text } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { Preference } from "@/model/Preference";
// import FoodPreferencesListItem from "@/components/FoodPreferenceListItem";
// import TitleHeader from "@/components/TitleHeader";
// import BackButton from "@/components/BackButton";
// import CategoryContainer from "@/components/PreferencesComponents/CategoryContainer";
// import { ScrollView } from "react-native-gesture-handler";

// const preferences: Preference[] = [
//   { name: "Vegetarian" },
//   { name: "Vegan" },
//   { name: "Halal" },
//   { name: "Gluten-Free" },
//   { name: "Dairy-Free" },
//   { name: "Nut-Free" },
//   { name: "Kosher" },
//   { name: "Pescatarian" },
// ];
// const preferences2: Preference[] = [
//   { name: "Vegetarian" },
//   { name: "Vegan" },
//   { name: "Halal" },
//   { name: "Gluten-Free" },
//   { name: "Dairy-Free" },
//   { name: "Nut-Free" },
//   { name: "Kosher" },
//   { name: "Pescatarian" },
// ];
// const preferences3: Preference[] = [
//   { name: "Vegetarian" },
//   { name: "Vegan" },
//   { name: "Halal" },
//   { name: "Gluten-Free" },
//   { name: "Dairy-Free" },
//   { name: "Nut-Free" },
//   { name: "Kosher" },
//   { name: "Pescatarian" },
// ];

// const FavouriteSpotsView: React.FC = () => {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       <TitleHeader title="Food Preferences" />
//       <View style={styles.content}>
//         <BackButton />
//       </View>
//       <ScrollView>
//         <View>
//           <CategoryContainer
//             title="Food Preferences 1"
//             preferences={preferences}
//           />
//           <CategoryContainer
//             title="Food Preferences 1"
//             preferences={preferences}
//           />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   content: {
//     flex: 1,
//     marginTop: 120,
//   },
//   listContainer: {
//     flex: 1,
//     padding: 10,
//   },
//   mainContainer: {
//     flex: 1,
//     // padding: 10,
//   },

//   categoryTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   divider: {
//     resizeMode: "contain",
//     width: "100%",
//   },
//   flatListContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
// });

// export default FavouriteSpotsView;

// FoodPreferencesView.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Preference } from "@/model/Preference";
import { fetchPreferences } from "@/controller/DatabaseHandler";
import { useAuth } from "@/context/AuthContext";
// import FoodPreferencesListItem from "@/components/FoodPreferenceListItem";
// import CategoryContainer from "@/components/PreferencesComponents/CategoryContainer";

const FoodPreferencesView: React.FC = () => {
//   const { user } = useAuth();
//   const [preferences, setPreferences] = useState<Preference[]>([]);
//   const [selectedPreferences, setSelectedPreferences] = useState<Preference[]>([]);

//   useEffect(() => {
//     const fetchPreferences = async () => {
//       if (user?.uid) {
//         const userPreferences = await fetchUserPreferences(user.uid);
//         setPreferences(userPreferences);
//         setSelectedPreferences(userPreferences.filter(pref => pref.selected));
//       }
//     };
//     fetchPreferences();
//   }, [user]);

//   const handleToggle = async (preference: Preference) => {
//     if (user?.uid) {
//       await updateUserPreferences(user.uid, preference.name, !preference.selected);
//       const updatedPreferences = preferences.map(pref =>
//         pref.name === preference.name ? { ...pref, selected: !pref.selected } : pref
//       );
//       setPreferences(updatedPreferences);
//       setSelectedPreferences(updatedPreferences.filter(pref => pref.selected));
//     }
//   };

  return (
    <View>
    </View>
    // <ScrollView>
    //   <View style={styles.container}>
    //     <Text style={styles.title}>Food Preferences</Text>
    //     {preferences.map((preference) => (
    //       <FoodPreferencesListItem
    //         key={preference.name}
    //         preference={preference}
    //         selectedPreferences={selectedPreferences}
    //         setSelectedPreferences={handleToggle}
    //       />
    //     ))}
    //   </View>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default FoodPreferencesView;
