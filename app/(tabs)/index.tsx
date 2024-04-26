import { FlatList, StyleSheet, Text} from 'react-native';
import RestaurantListItem from '@/components/RestaurantListItem'
import restaurants from '@/assets/data/restaurants';
import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import TitleHeader from '@/components/TitleHeader';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/model/AppContext';

export default function HomeView() {
  const { localRestaurants } = useContext(AppContext);
  const [filteredRestaurants, setFilteredRestaurants] = useState(localRestaurants);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if(!searchTerm){
      setFilteredRestaurants(localRestaurants);
      console.log(localRestaurants);
    }
    else {
      setFilteredRestaurants(localRestaurants.filter((restaurants) => {
        return restaurants.name.toLowerCase().includes(searchTerm.toLowerCase());
      }))
      console.log(filteredRestaurants);
    }
  },[searchTerm])
  
  return (
    <View style={{flex: 1}}>
      <TitleHeader 
      searchBar={true}
      onSearchSubmit={setSearchTerm}
      />
      <View style={styles.background}>
        <FlatList 
          data={filteredRestaurants}
          renderItem={({ item }) => < RestaurantListItem restaurant={item} />}
          contentContainerStyle={{ gap: 3 }}
          ListEmptyComponent={<View style={styles.noMatches}><Text>No Results</Text></View>}
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
  noMatches: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: 'grey',
  },
});