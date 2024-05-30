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
import { Sort } from "@/model/Sort";
import { sortOptions } from "@/model/sort-options";

// Define the props for the Filters component
interface SortProps {
  onSortSelect: (toSort: Sort) => void;
}

/**
 *  SortButton component that allows the user to select a filter
 * @param param0 - onSortSelect function to handle the selected sorter
 * @returns - Sort component
 */
const Filters: React.FC<SortProps> = ({ onSortSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<Sort>(sortOptions[0]);

  const handleFilterChange = (toSort: Sort) => {
    if (toSort) {
      onSortSelect(selectedSort);
      setSelectedSort(selectedSort);
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "android" ? (
        <Picker
          selectedValue={selectedSort}
          mode="dialog"
          style={styles.picker}
          dropdownIconColor="#000"
          onValueChange={(itemValue) => handleFilterChange(itemValue)}
        >
          {sortOptions.map((option) => (
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
              <Text>{selectedSort?.filter || "Sort By"}</Text>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            style={styles.modal}
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              setSelectedSort(sortOptions[0]);
            }}
          >
            <View>
              {sortOptions.map((option) => (
                <Button
                  key={option.filter}
                  title={option.filter || "Filter"}
                  onPress={() => {
                    handleFilterChange(option);
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
