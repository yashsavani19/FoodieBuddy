import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import DrawerContext from "@/context/DrawerContext"; 

// See: https://oblador.github.io/react-native-vector-icons/

const FilterButton = ({ onPress }: { onPress: any }) => {
  const { open } = useContext(DrawerContext);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button} testID='Filter Button' disabled={open}>
        <Text style={styles.text}>Filter By</Text>
        <FontAwesome6 name="filter" size={11.5} color="#363232" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 20,
    borderRadius: 20,
    height: "100%",
  },
  text: {
    color: '#363232',
    fontSize: 12.5,
  },
  container: {
    width: "46%",
    marginTop: 10,
    height: "52%",
    justifyContent: "center",
    marginBottom: 2,
  },
});

export default FilterButton;