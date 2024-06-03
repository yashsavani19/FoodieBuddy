import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Sort } from "@/model/Sort";
import { SortOptions } from "@/model/SortOptions";;
import { AppContext } from "@/context/AppContext";

// Define the props for the Filters component
interface SortProps {
  onSortSelect: (toSort: Sort) => void;
}

/**
 *  SortButton component that allows the user to select a filter
 * @param param0 - onSortSelect function to handle the selected sorter
 * @returns - Sort component
 */
const SortTab: React.FC<SortProps> = ({ onSortSelect }) => {
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<Sort>(SortOptions[0]);

  const handleSortChange = (toSort: Sort) => {
    if (toSort) {
      onSortSelect(toSort);
      setSelectedSort(toSort);
    }else{
      setSelectedSort(SortOptions[0]);
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "android" ? (
        <RNPickerSelect
          items={SortOptions.map((option) => ({
            label: option.sortOption || "",
            value: option,
          }))}
          onValueChange={(value) => handleSortChange(value)}
          style={pickerSelectStyles}
          value={selectedSort}
          useNativeAndroidPickerStyle={false}
          placeholder={{}}
        />
      ) : (
        <>
          <View style={styles.sortButton}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text>{selectedSort?.sortOption || "Sort By"}</Text>
              
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {SortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.sortOption}
                    style={styles.modalOption}
                    onPress={() => {

                      
                      handleSortChange(option);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>
                      {option.sortOption}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

export default SortTab;

const styles = StyleSheet.create({
  container: {
    width:"auto",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginBottom:2,
    
  },
  sortButton: {
    width: 170,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height:"50%",
    
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalOption: {
    padding: 15,
    width: "100%",
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 18,
  },
  modalClose: {
    marginTop: 20,
  },
  modalCloseText: {
    fontSize: 18,
    color: "red",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: "white",
  },
  inputAndroid: {
    fontSize: 12,
    paddingLeft: 10,
    borderColor: "gray",
    borderRadius: 100,
    color: "black",
    paddingHorizontal: 10, // to ensure the text is never behind the icon
    backgroundColor: "white",
    width:130,
    textAlign: "center",
    height:30,
  },
});
