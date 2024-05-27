import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Category } from '@/model/Category';

type CategoryButtonProps = {
    category: any;
    toPrint?: any;
    selected: Category[];
    setSelected: (selected: Category[]) => void;
};

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, selected, setSelected, toPrint }) => {
    function setSelectedColor(category: Category) {
        return selected.includes(category) ? '#F26722' : '#727272';
    }

    // Update if we want to add another type of category to have one selected at a time
    const toSelectOneAtATime = ['Rating']

    function handleCategorySelect(category: Category) {
        if (selected.includes(category)) {
            setSelected(selected.filter((selectedCategory) => selectedCategory !== category));
        } 
        
        else {
            if (toSelectOneAtATime.includes(category.type)) { // Handle case where we want to select only one category at a time
                const filtered = selected.filter(selectedCategory => selectedCategory.type !== category.type);
                setSelected([...filtered, category]);
            } 
            else {
                setSelected([...selected, category]);
            }
        }
    }

    return (
        <View key={category.id} style={{paddingRight: 2}}>
            <Pressable
                style={[styles.category, { borderColor: setSelectedColor(category) }]}
                onPress = {() => {
                    handleCategorySelect(category);
                }}
                testID = {`${category.type !== "Price" ? category.name : category.apiName}`}
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
