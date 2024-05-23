import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Category } from '@/model/Category';

type CategoryButtonProps = {
    category: {
        id: number;
        name: string;
        apiName: string;
        type: string;

    };
    filters: Category[];
    setFilters: (filters: Category[]) => void;
};

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, filters, setFilters }) => {
    function setSelectedColor(category: Category) {
        return filters.includes(category) ? '#F26722' : '#727272';
    }

    const toFilter = category;

    return (
        <View key={category.id} style={{paddingRight: 2}}>
            <Pressable
                style={[styles.category, { borderColor: setSelectedColor(category) }]}
                onPress = {() => {
                    filters.includes(category) ?
                        setFilters(filters.filter(filter => filter !== toFilter)) :
                        setFilters([...filters, toFilter]);
                }}
            >
                <Text style={[styles.categoryText, { color: setSelectedColor(category) }]}>{category.name}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
    },
    item: {
        marginVertical: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    category: {
        borderRadius: 100,
        borderWidth: 2.5,
        padding: 5,
        paddingHorizontal: 10,
        borderColor: '#363232'
    },
    categoryText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default CategoryButton;
