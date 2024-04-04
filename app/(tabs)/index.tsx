import { FlatList, StyleSheet } from 'react-native';
import RestaurantListItem from '@/components/RestaurantListItem'
import restaurants from '@/assets/data/restaurants';
import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function HomeView() {
  return (
    <View style={styles.background}>
      <FlatList 
        data={restaurants}
        renderItem={({ item }) => < RestaurantListItem restaurant={item} />}
        contentContainerStyle={{ gap: 3 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
});