
import * as React from 'react';
import { RefObject, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from '../Themed';
import CategoryContainer from './CategoryContainer';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { categories } from "@/assets/data/categories-options";
import CategoryButton from './CategoryButton';
import { Category } from '@/model/Category';
import StarRating from '../StarRating';
import Slider from '@react-native-community/slider';
import { formatDistance } from '@/app/Utils/FormatDistance';
import { MaterialIcons } from '@expo/vector-icons';

interface DrawerContentProps {
    onApplyFilters: (filters: Category[], distance: number) => void;
    setScrollViewRef: (ref: RefObject<ScrollView>) => void;
  }  

  const DrawerContent: React.FC<DrawerContentProps> = ({ onApplyFilters, setScrollViewRef }) => {
    const [filters, setFilters] = useState<Category[]>([]);
    const [distance, setDistance] = useState<number>(1.0);
    const scrollViewRef = React.useRef<ScrollView>(null);

    return (
        <SafeAreaView style = {{marginHorizontal: 10}}>
            <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                <View>
                    <TouchableOpacity onPress={() => {setFilters([]); setDistance(1.0)}} style={styles.clearAllButton}>
                        <MaterialIcons name="cancel" size={20} color="#CC4843" />
                        <Text style={{color: '#CC4343', fontWeight: 'bold'}}> Clear All</Text>
                    </TouchableOpacity>

                    <CategoryContainer title="Cuisine Types">
                        {categories.filter(categories => categories.type === "Cuisine Type").map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category}
                                selected={filters} 
                                setSelected={setFilters} />
                        ))}
                    </CategoryContainer>

                    <CategoryContainer title="Food Categories">
                        {categories.filter(categories => categories.type === "Food Category").map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category} 
                                selected={filters} 
                                setSelected={setFilters} />
                        ))}
                    </CategoryContainer>

                    <CategoryContainer title="Eating Spot Types">
                        {categories.filter(categories => categories.type === "Eating Spot Type").map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category} 
                                selected={filters} 
                                setSelected={setFilters} />
                        ))}
                    </CategoryContainer>
                    
                    <CategoryContainer title="Dietary Preferences">
                        {categories.filter(categories => categories.type === "Dietary Preference").map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category}
                                selected={filters} 
                                setSelected={setFilters} />
                        ))}
                    </CategoryContainer>

                    <CategoryContainer title="Price Range">
                        {categories.filter(categories => categories.type === "Price").map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category} 
                                selected={filters} 
                                setSelected={setFilters} />
                        ))}
                    </CategoryContainer>

                    <CategoryContainer title="Rating Range">
                        {categories.filter(categories => categories.type === "Rating").reverse().map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category} 
                                selected={filters} 
                                setSelected={setFilters}
                                toPrint={<StarRating rating={category.rating || 1} />} />
                        ))}
                    </CategoryContainer>

                    <View style={{paddingVertical: 10}} />

                    <CategoryContainer title="Maximum Distance">
                        <View style = {styles.container}>
                            <Text style={styles.text}>{formatDistance(distance.toString())}</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0.1}
                                maximumValue={5}
                                step={0.1}
                                minimumTrackTintColor="#F26722"
                                thumbTintColor='#F26722'
                                value={distance}
                                onValueChange={value => setDistance(parseFloat(value.toFixed(1)))}
                            />
                        </View>
                    </CategoryContainer>

                    <View style={styles.bigButtonsContainer}>
                        {categories.filter(categories => categories.type === "Open Status").map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category} 
                                selected={filters} 
                                setSelected={setFilters} />
                        ))}

                        {categories.filter(categories => categories.type === "Takeaway Option").map((category) => (
                            <CategoryButton 
                                key={category.id} 
                                category={category} 
                                selected={filters} 
                                setSelected={setFilters} />
                        ))}
                    </View>

                    <View style={{paddingTop: 40, paddingBottom: 25}} >
                        <ApplyFiltersButton onPress={() => {onApplyFilters(filters, distance)} } />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const ApplyFiltersButton = ({ onPress }: { onPress: () => void }) => (
    <View style={styles.container} testID='Apply Filters Button'>
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>Apply Filters</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    text: {
        width: "20%", 
        textAlign: 'right',
        paddingBottom: 2,
        fontWeight: 'bold',
        color: '#727272',
    },
    slider: {
        width: "77%", 
        height: 40,
        left: "5%",
    },
    container: {
        flexDirection: "row", 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    clearAllButton: {
        flexDirection: "row", 
        justifyContent: 'flex-end', 
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    bigButtonsContainer: {
        marginTop: 20,
        flexDirection: 'column',
        rowGap: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#363232',
        marginVertical: 15,
        textAlign: 'center',
    },
    line: {
        height: 2,
        backgroundColor: '#A6A6A6',
        borderRadius: 20,  
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#4B8DEF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        height: 40,
        width: "100%",
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 15.5,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default DrawerContent;