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
import { SortOptions } from "@/model/SortOptions";
import Icon from 'react-native-vector-icons/FontAwesome';

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
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text 
            style={styles.text} 
            ellipsizeMode='tail' 
            numberOfLines={1}>
            {selectedSort?.sortOption || "Sort By"}
          </Text>
          <Icon style={{paddingLeft: 25, textAlignVertical: 'center'}} name="sort" size={18} color="#363232" />
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
                <Text style={selectedSort.sortOption === option.sortOption ? styles.modalOptionTextSelected : styles.modalOptionTextNotSelected}>
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
    </View>
  );
};

export default SortTab;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start', 
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    height: "100%",
    width: 130,
    alignItems: 'center',
    overflow: 'hidden',
  },
  text: {
    color: '#363232',
    fontSize: 12.5,
    textAlignVertical: 'center',
    flexShrink: 1,
    overflow: 'hidden', 
    width: '70%', 
  },
  container: {
    width: "auto",
    marginTop: 5,
    height: "73%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
  },
  modalContent: {
    width: "85%",
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
  modalOptionTextSelected: {
    fontSize: 18,
    color: '#F26722',
    
    fontWeight: "500",
  },
  modalOptionTextNotSelected: {
    fontSize: 18,
    color: '#363232',
  },
  modalClose: {
    backgroundColor: '#4B8DEF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 40,
    width: "100%",
    marginTop: 35,
  },
  modalCloseText: {
    fontSize: 18,
    color: "white",
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
