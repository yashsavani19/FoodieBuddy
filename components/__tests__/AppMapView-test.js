import React from 'react';
import renderer from 'react-test-renderer'; // Import necessary testing utilities
import AppMappView from '../AppMappView'; // Import the component to be tested

// Mocked localRestaurants data
const mockedLocalRestaurants = [
  {
    name: 'Restaurant 1',
    rating: 4.5,
    distance: 2,
    website: 'https://www.restaurant1.com',
    geometry: {
      location: {
        lat: 1.2345,
        lng: 1.2345,
      },
    },
  },
  {
    name: 'Restaurant 2',
    rating: 3.8,
    distance: 3,
    website: 'https://www.restaurant2.com',
    geometry: {
      location: {
        lat: 2.3456,
        lng: 2.3456,
      },
    },
  },
];

// Mocking react-native-maps components
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => {
      return <View {...props} />;
    },
    Marker: (props) => {
      return <View {...props} />;
    },
    Callout: (props) => {
      return <View {...props} />;
    },
    Circle: (props) => {
      return <View {...props} />;
    },
    PROVIDER_GOOGLE: 'PROVIDER_GOOGLE',
  };
});

// Test suite for the AppMappView component
describe('<AppMappView />', () => {
  // Test for rendering the component without crashing
  test('renders without crashing', () => {
    const tree = renderer.create(<AppMappView />).toJSON(); // Render the component
    expect(tree).toMatchSnapshot(); // Check if the rendered tree matches the snapshot
  });

  // Test for filtering restaurants based on search term
  test('filters restaurants based on search term', () => {
    const tree = renderer
      .create(<AppMappView searchTerm="Restaurant 1" localRestaurants={mockedLocalRestaurants} />) // Render the component with search term
      .toJSON();
    expect(tree).toMatchSnapshot(); // Check if the rendered tree matches the snapshot
  });

  // Test for animating to selected restaurant location
  test('animates to selected restaurant location', () => {
    const tree = renderer
      .create(
        <AppMappView
          geometry={{ location: { lat: 1.2345, lng: 1.2345 } }}
          localRestaurants={mockedLocalRestaurants}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot(); // Check if the rendered tree matches the snapshot
  });

  // Test for showing callout for selected restaurant
  test('shows callout for selected restaurant', () => {
    const tree = renderer
      .create(
        <AppMappView
          geometry={{ location: { lat: 1.2345, lng: 1.2345 } }}
          localRestaurants={mockedLocalRestaurants}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot(); // Check if the rendered tree matches the snapshot
  });
});
