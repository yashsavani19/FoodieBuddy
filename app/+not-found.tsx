import { Link, Stack, useNavigation } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import React from 'react';
import { RootStackParamList } from '@/constants/navigationTypes';
import { NavigationProp } from '@react-navigation/native';

export default function NotFoundScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Pressable style={styles.container} onPress={()=>{navigation.navigate("index")}} >
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
