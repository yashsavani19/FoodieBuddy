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
                <Picker
                    selectedValue={selectedFilters}
                    // onValueChange={(itemValue) => handleFilterChange(itemValue as string)}
                    mode="dialog"
                    style={styles.picker}
                    dropdownIconColor="#000"
                >
                    {filterOptions.map((option) => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                </Picker>
    );
};

export default Filters;

const styles = StyleSheet.create({
    picker: {
        width: '50%',
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
});