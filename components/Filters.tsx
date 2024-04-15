import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Filter } from "@/model/Filter";
import { filterOptions } from "@/assets/data/filters";

interface FilterOption {
  label: string;
  value: string;
  onFilterSelect?: (filter: Filter) => void;
}

interface FiltersProps {
  onFilterSelect: (filter: Filter[]) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterSelect }) => {
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);

  const handleFilterChange = (filters: Filter[]) => {
    if (filters) {
      onFilterSelect(filters);
      setSelectedFilters(filters);
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedFilters}
        mode="dialog"
        style={styles.picker}
        dropdownIconColor="#000"
        onValueChange={(itemValue) => handleFilterChange(itemValue)}
      >
        {filterOptions.map((option) => (
          <Picker.Item
            key={option.filter}
            label={option.filter}
            value={option}
            style={styles.pickerItem}
          />
        ))}
      </Picker>
    </View>
  );
};

export default Filters;

const styles = StyleSheet.create({
  container: {
    width: "45%",
    borderRadius: 20, // Adjust border radius to make it look like a pill
    overflow: "hidden", // Ensure contents stay within the rounded borders
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
