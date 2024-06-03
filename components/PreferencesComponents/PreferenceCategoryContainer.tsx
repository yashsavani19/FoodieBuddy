import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import PreferenceButton from "./PreferenceButton";
import { Preference } from "@/model/Preference";

interface PreferenceCategoryContainerProps {
  title: string;
  preferences: Preference[];
  disabled?: boolean;
  onToggle: (preferenceName: string) => void;
}

const PreferenceCategoryContainer: React.FC<
  PreferenceCategoryContainerProps
> = ({ title, preferences, disabled, onToggle }) => {
  const divider = require("@/assets/images/Divider.png");
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Image source={divider} style={styles.divider} />
      </View>
      <View style={styles.preferences}>
        {preferences.map((preference) => (
          <PreferenceButton
            disabled={disabled}
            key={preference.name}
            name={preference.name}
            selected={preference.selected}
            onToggle={() => onToggle(preference.name)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#363232",
  },
  preferences: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  divider: {
    width: "100%",
    height: 3,
    marginBottom: 10,
  },
});

export default PreferenceCategoryContainer;
