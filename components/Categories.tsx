import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Category } from "@/model/Category";
import { categories } from "@/assets/data/categories-options";

interface CategorySelectProps {
  onCategorySelect: (category: Category) => void;
}

const Categories: React.FC<CategorySelectProps> = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    {} as Category
  );

  const sortedCategories = categories.sort((a, b) =>
    a.name && b.name ? a.name.localeCompare(b.name) : 0
  );

  const handleCategoryChange = (value: Category) => {
    if (value) {
      setSelectedCategory(value);
      onCategorySelect(value);
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCategory ? selectedCategory : categories[0]}
        mode="dropdown"
        style={styles.picker}
        dropdownIconColor="#000"
        onValueChange={(itemValue) => handleCategoryChange(itemValue)}
      >
        {sortedCategories.map((option) => (
          <Picker.Item
            key={option.id}
            label={option.name}
            value={option}
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
    width: "50%",
    borderRadius: 20, // Adjust border radius to make it look like a pill
    overflow: "hidden", // Ensure contents stay within the rounded borders
    // marginBottom: 10,
    marginTop: 10,
    height: "50%",
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
