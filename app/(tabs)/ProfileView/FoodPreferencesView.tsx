import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import PreferenceCategoryContainer from "@/components/PreferencesComponents/PreferenceCategoryContainer";
import SavePreferenceButton from "@/components/PreferencesComponents/SavePreferenceButton";
import { AppContext } from "@/context/AppContext";
import { updatePreferences } from "@/controller/DatabaseHandler";
import { PreferenceCategoryList } from "@/model/PreferenceCategoryList";
import TitleHeader from "@/components/TitleHeader";
import BackButton from "@/components/BackButton";
import Constants from "expo-constants";
import { DefaultPreferences } from "@/model/DefaultPreferences";

const FoodPreferencesView: React.FC = () => {
  const { preferences, setPreferences } = useContext(AppContext);
  const [localPreferences, setLocalPreferences] = useState<PreferenceCategoryList[]>(
    preferences
  );

  // If no preferences are passed, load default preferences
  useEffect(() => {
    if (preferences.length === 0) {
      const defaultPreferences: PreferenceCategoryList[] = DefaultPreferences;
      setPreferences(defaultPreferences);
      setLocalPreferences(defaultPreferences);
    }
  }, []);

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
      try {
        await updatePreferences(localPreferences);
        setPreferences(localPreferences);
        console.log("Preferences saved successfully");
      } catch (error) {
        console.error("User ID is missing");
      }
    } catch (error) {
      console.error("Error saving preferences: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TitleHeader title="Preferences" />
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
          <View style={{ marginBottom: 40 }} />
        </ScrollView>
        <View style={{ marginBottom: 5 }}>
          <SavePreferenceButton onSave={savePreferences} />
        </View>
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
    marginTop: Constants.statusBarHeight + 100,
  },
});

export default FoodPreferencesView;
