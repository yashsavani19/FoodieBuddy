import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);

  const handleFilterChange = (filters: Filter[]) => {
    if (filters) {
      onFilterSelect(filters);
      setSelectedFilters(filters);
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "android" ? (
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
      ) : (
        <>
          <View style={styles.loginButton}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text>{selectedFilters[0]?.filter || "Filter"}</Text>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            style={styles.modal}
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              setSelectedFilters([filterOptions[0]]);
            }}
          >
            <View>
              {filterOptions.map((option) => (
                <Button
                  key={option.filter}
                  title={option.filter || "Filter"}
                  onPress={() => {
                    handleFilterChange([option]);
                    setModalVisible(false);
                  }}
                />
              ))}
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

export default Filters;

const styles = StyleSheet.create({
  container: {
    width: "45%",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
    height: "50%",
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    backgroundColor: "#fff",
  },
  pickerItem: {
    fontSize: 12,
  },
  loginButton: {
    height: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    margin: 40,
  },
});
