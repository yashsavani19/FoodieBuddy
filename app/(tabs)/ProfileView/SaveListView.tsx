import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function SaveListView() {
  return (
    <View style={styles.container}>
      {/* Title of the view */}
      <Text style={styles.title}>Save List View</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
