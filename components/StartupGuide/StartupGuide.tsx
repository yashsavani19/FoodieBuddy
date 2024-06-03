import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    text: 'Welcome to Foodie Buddy!',
    image: require('@images/BuddyBod.png'),
  },
  {
    key: '2',
    text: 'Filter eating spots to your heart’s content',
    image: require('@images/page 1.png'),
  },
  {
    key: '3',
    text: 'Find eating spots on the map',
    image: require('@images/page 2.png'),
  },
  {
    key: '4',
    text: 'Ask Buddy to provide eating spot recommendations',
    image: require('@images/page 3.png'),
  },
  {
    key: '5',
    text: 'Add friends, make group chats, and invite Buddy',
    image: require('@images/page 4.png'),
  },
  {
    key: '6',
    text: 'Choose personal preferences to get restaurant recommendations',
    image: require('@images/page 5.png'),
  },
];

const StartupGuide = () => (
  <Swiper
    style={styles.wrapper}
    showsButtons={true}
    dot={<View style={styles.dot} />}
    activeDot={<View style={styles.activeDot} />}
  >
    {slides.map(slide => (
      <View style={styles.slide} key={slide.key}>
        <Image source={slide.image} style={styles.image} />
        <Text style={styles.text}>{slide.text}</Text>
      </View>
    ))}
  </Swiper>
);

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: width - 60,
    height: '70%',
    resizeMode: 'contain',
  },
  text: {
    color: '#000',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  dot: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#FF6347', 
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
});

export default StartupGuide;
