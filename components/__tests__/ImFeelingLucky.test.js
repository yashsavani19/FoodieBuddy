import React from 'react';
import { render } from '@testing-library/react-native';
import ImFeelingLucky from '../ImFeelingLucky'; // Adjust the import according to your file structure
import { AppContext } from '@/context/AppContext';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';

jest.mock('expo-router', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

const mockContextValue = {
  localRestaurants: [{ name: 'Restaurant 1' }, { name: 'Restaurant 2' }],
};

test('renders correctly', () => {
  const { getByTestId } = render(
    <AppContext.Provider value={mockContextValue}>
      <NavigationContainer>
        <ImFeelingLucky>
          <Text>I'm Feeling Lucky</Text>
        </ImFeelingLucky>
      </NavigationContainer>
    </AppContext.Provider>
  );
  expect(getByTestId('lucky-button')).toBeTruthy();
});
