import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// See: https://oblador.github.io/react-native-vector-icons/

const FilterButton = ({ onPress }: { onPress: any }) => (
    <View style={styles.container}>
        <TouchableOpacity onPress={onPress} style={styles.button} testID='Filter Button'>
            <Text style={styles.text}>Filter By</Text>
            <Icon name="caret-down" size={15} color="#363232" />
        </TouchableOpacity>
    </View>
);

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
    width: "50%",
    overflow: "hidden",
    marginTop: 10,
    height: "50%",
    justifyContent: "center",
  },
});

export default FilterButton;