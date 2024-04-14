import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface FilterOption {
    label: string;
    value: string;
}

const Filters: React.FC = () => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const filterOptions: FilterOption[] = [
        { label: 'Filter 1', value: 'filter1' },
        { label: 'Filter 2', value: 'filter2' },
        { label: 'Filter 3', value: 'filter3' },
        // Add more options as needed
    ];

    const handleFilterChange = (value: string) => {
        if (selectedFilters.includes(value)) {
            setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
        } else {
            setSelectedFilters([...selectedFilters, value]);
        }
    };

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={selectedFilters}
                mode="dialog"
                style={styles.picker}
                dropdownIconColor="#000"
            >
                {filterOptions.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} style={styles.pickerItem} />
                ))}
            </Picker>
        </View>
    );
};

export default Filters;

const styles = StyleSheet.create({
    container: {
        width: '45%',
        borderRadius: 20, // Adjust border radius to make it look like a pill
        overflow: 'hidden', // Ensure contents stay within the rounded borders
        marginBottom: 10,
        marginTop: 10,
        height: '40%',
        justifyContent: 'center'
    },
    picker: {
        width: '100%',
        backgroundColor: '#fff',
    },
    pickerItem: {
        fontSize: 12, // Adjust the font size as needed
    },
});
