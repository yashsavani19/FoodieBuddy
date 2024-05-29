
import React, { useContext, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import PreferenceCategoryContainer from "@/components/PreferencesComponents/PreferenceCategoryContainer";
import SavePreferenceButton from "@/components/PreferencesComponents/SavePreferenceButton";
import { AppContext } from "@/context/AppContext";
import { updatePreferences } from "@/controller/DatabaseHandler";
import { PreferenceList } from "@/model/PreferenceList";
import TitleHeader from "@/components/TitleHeader";
import BackButton from "@/components/BackButton";
import { update } from "firebase/database";

const FoodPreferencesView: React.FC = () => {
  const { preferences, setPreferences, userObject, updateUserPreferences } =
    useContext(AppContext);
  const [localPreferences, setLocalPreferences] =
    useState<PreferenceList[]>(preferences);

  const togglePreference = (category: string, preferenceName: string) => {
    const updatedPreferences = localPreferences.map((categoryItem) =>
      categoryItem.title === category
        ? {
            ...categoryItem,
            preferences: categoryItem.preferences.map((pref) =>
              pref.name === preferenceName
                ? { ...pref, selected: !pref.selected }
                : pref
            ),
          }
        : categoryItem
    );
    setLocalPreferences(updatedPreferences);
  };

  const savePreferences = async () => {
    try {
      try{
        await updatePreferences(localPreferences);
        setPreferences(localPreferences);
        console.log("Preferences saved successfully");
      } catch (error){
        console.error("User ID is missing");
      }
    } catch (error) {
      console.error("Error saving preferences: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TitleHeader title="Food Preferences" />
      <View style={styles.content}>
        <BackButton />

        <ScrollView style={styles.mainContainer}>
          {localPreferences.map((categoryItem) => (
            <PreferenceCategoryContainer
              key={categoryItem.title}
              title={categoryItem.title}
              preferences={categoryItem.preferences}
              onToggle={(preferenceName) =>
                togglePreference(categoryItem.title, preferenceName)
              }
            />
          ))}
        </ScrollView>
        <SavePreferenceButton onSave={savePreferences} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    marginVertical: 5,
  },
  content: {
    flex: 1,
    marginTop: 120,
  },
});

export default FoodPreferencesView;
