import React from 'react';
import { render } from '@testing-library/react-native';
import StartupGuide from '../modals/StartupGuide'; // Adjust the import according to your file structure

test('renders all slides correctly', () => {
  const { getByText } = render(<StartupGuide onClose={jest.fn()} />);

  expect(getByText('Welcome to Foodie Buddy!')).toBeTruthy();
  expect(getByText('Filter eating spots to your heart’s content')).toBeTruthy();
  expect(getByText('Find eating spots on the map')).toBeTruthy();
  expect(getByText('Ask Buddy to provide eating spot recommendations')).toBeTruthy();
  expect(getByText('Add friends, make group chats, and invite Buddy')).toBeTruthy();
  expect(getByText('Choose personal preferences to get restaurant recommendations')).toBeTruthy();
});
