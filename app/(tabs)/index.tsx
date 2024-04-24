import { FlatList, StyleSheet } from 'react-native';
import RestaurantListItem from '@/components/RestaurantListItem'
import restaurants from '@/assets/data/restaurants';
import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import TitleHeader from '@/components/TitleHeader';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/model/AppContext';
import { categories } from '@/assets/data/categories-picker';
import { Category } from '@/model/Category';

export default function HomeView() {
  const { localRestaurants } = useContext(AppContext);
  const [filteredRestaurants, setFilteredRestaurants] = useState(localRestaurants);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  
  useEffect(() => {
    let result = localRestaurants;
  
    if (selectedCategory && selectedCategory.name !== "All") {
      if (selectedCategory && ["Restaurant", "Bar", "Bakery", "Cafe"].includes(selectedCategory.name)) 
      {
        result = result.filter((restaurant) => {
          return restaurant.categories && restaurant.categories.map(category => category.toLowerCase()).includes(selectedCategory.name.toLowerCase());
        });
      }
      else 
      {
        result = result.filter((restaurant) => {
          return restaurant.name && restaurant.name.toLowerCase().includes(selectedCategory.name.toLowerCase());
        });
      }
    }
  
    if (searchTerm) {
      result = result.filter((restaurant) => {
        return restaurant.name && restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
  
    setFilteredRestaurants(result);
    
  },[searchTerm, selectedCategory, localRestaurants])

  useEffect(() => {
    console.log(filteredRestaurants === undefined ? 'No restaurants found' : filteredRestaurants.length + ' restaurants found');
  }, [filteredRestaurants]);

  return (
    <View style={{flex: 1}}>
      <TitleHeader 
      searchBar={true}
      onSearchSubmit={setSearchTerm}
      onCategorySelect={setSelectedCategory}
      />
      <View style={styles.background}>
        <FlatList 
          data={filteredRestaurants}
          renderItem={({ item }) => < RestaurantListItem restaurant={item} />}
          contentContainerStyle={{ gap: 3 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    marginTop: 120,
  },
});