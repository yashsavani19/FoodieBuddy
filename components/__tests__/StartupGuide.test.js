import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StartupGuide from '@/components/modals/StartupGuide';

// Mock the AntDesign component from @expo/vector-icons
jest.mock('@expo/vector-icons/AntDesign', () => {
  return (props) => <div {...props} className="mock-antdesign-icon" />;
});

describe('StartupGuide', () => {
  it('renders correctly and matches snapshot', () => {
    const { toJSON } = render(<StartupGuide onClose={jest.fn()} />);
    expect(toJSON()).toMatchSnapshot();
  });

  // it('calls onClose when the close button is pressed', () => {
  //   const onCloseMock = jest.fn();
  //   const { getByTestId } = render(<StartupGuide onClose={onCloseMock} />);

  //   const closeButton = getByTestId('close-button');
  //   fireEvent.press(closeButton);

  //   expect(onCloseMock).toHaveBeenCalled();
  // });

  // it('renders all slides correctly', () => {
  //   const { getByText } = render(<StartupGuide onClose={jest.fn()} />);

  //   expect(getByText('Welcome to Foodie Buddy!')).toBeTruthy();
  //   expect(getByText('Filter eating spots to your heart’s content')).toBeTruthy();
  //   expect(getByText('Find eating spots on the map')).toBeTruthy();
  //   expect(getByText('Ask Buddy to provide eating spot recommendations')).toBeTruthy();
  //   expect(getByText('Add friends, make group chats, and invite Buddy')).toBeTruthy();
  //   expect(getByText('Choose personal preferences to get restaurant recommendations')).toBeTruthy();
  // });

  // it('swipes to the next slide', () => {
  //   const { getByTestId, getByText } = render(<StartupGuide onClose={jest.fn()} />);

  //   const swiper = getByTestId('swiper');

  //   // Verify the first slide
  //   expect(getByText('Welcome to Foodie Buddy!')).toBeTruthy();

  //   // Simulate swipe to the next slide
  //   fireEvent.scroll(swiper, {
  //     nativeEvent: {
  //       contentOffset: {
  //         x: 375, // Width of one slide (adjust based on your screen width)
  //         y: 0,
  //       },
  //       contentSize: {
  //         width: 375 * 6, // Total width for 6 slides
  //         height: 100,
  //       },
  //       layoutMeasurement: {
  //         width: 375, // Width of one slide (adjust based on your screen width)
  //         height: 100,
  //       },
  //     },
  //   });

    // Verify the second slide
  //   expect(getByText('Filter eating spots to your heart’s content')).toBeTruthy();
  // });
});
