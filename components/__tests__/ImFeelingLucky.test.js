import React from 'react';
import { render } from '@testing-library/react-native';
import ImFeelingLucky from '../ImFeelingLucky';

jest.mock("@firebase/firestore", () => {
  return {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    addDoc: jest.fn().mockResolvedValue(),
    get: jest.fn().mockResolvedValue(),
    onSnapshot: jest.fn(),
  };
});

test('it renders correctly', () => {
  const { getByText } = render(<ImFeelingLucky />);
  expect(getByText('Expected Text')).toBeTruthy();
});
