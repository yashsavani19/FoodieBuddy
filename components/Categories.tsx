import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Category } from "@/model/Category";


interface CategorySelectProps {
  onCategorySelect: (category: Category) => void;
}

const Categories: React.FC<CategorySelectProps> = ({ onCategorySelect }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterChange = (value: string) => {
    if (selectedFilters.includes(value)) {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
    } else {
      setSelectedFilters([...selectedFilters, value]);
    }
    onCategorySelect(selectedFilters);
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedFilters}
        mode="dropdown"
        style={styles.picker}
        dropdownIconColor="#000"
      >
        {filterOptions.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
            style={styles.pickerItem}
          />
        ))}
      </Picker>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    width: "45%",
    borderRadius: 20, // Adjust border radius to make it look like a pill
    overflow: "hidden", // Ensure contents stay within the rounded borders
    marginBottom: 10,
    marginTop: 10,
    height: "40%",
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    backgroundColor: "#fff",
  },
  pickerItem: {
    fontSize: 12, // Adjust the font size as needed
  },
});
