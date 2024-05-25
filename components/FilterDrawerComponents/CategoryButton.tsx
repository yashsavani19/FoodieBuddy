import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Category } from '@/model/Category';

type CategoryButtonProps = {
    category: {
        id: number;
        name: string;
        type: string;
    };
    toPrint?: any;
    selected: Category[];
    setSelected: (selected: Category[]) => void;
};

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, selected, setSelected, toPrint }) => {
    function setSelectedColor(category: Category) {
        return selected.includes(category) ? '#F26722' : '#727272';
    }

    return (
        <View key={category.id} style={{paddingRight: 2}}>
            <Pressable
                style={[styles.category, { borderColor: setSelectedColor(category) }]}
                onPress = {() => {
                    selected.includes(category) ?
                    setSelected(selected.filter(selectedCategory => selectedCategory !== category)) :
                    setSelected([...selected, category]);
                }}
            >
                <Text style={[styles.categoryText, { color: setSelectedColor(category) }]}>{toPrint ? toPrint : category.name}</Text>
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
        padding: 6,
        paddingHorizontal: 10,
        borderColor: '#363232',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CategoryButton;
