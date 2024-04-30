import React, { useContext, useState } from "react";
import { View, StyleSheet, Platform, Text, Button, Modal, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Category } from "@/model/Category";
import { categories } from "@/assets/data/categories-options";
import { AppContext } from "@/context/AppContext";

interface CategorySelectProps {
  onCategorySelect: (category: Category) => void;
}

const Categories: React.FC<CategorySelectProps> = ({ onCategorySelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const { selectedCategory, setSelectedCategory } = useContext(AppContext);

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
      {Platform.OS === "android" ? (
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
      ) : (
        <>
        <View style={styles.loginButton}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text>{selectedCategory?.name || "Category"}</Text>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            style={styles.modal}
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              setSelectedCategory(categories[0]);
            }}
          >
            <View>
              {categories.map((option) => (
                <Button
                  key={option.id}
                  title={option.name}
                  onPress={() => {
                    handleCategoryChange(option);
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

export default Categories;

const styles = StyleSheet.create({
  container: {
    width: "50%",
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
