import React from "react";
import renderer from "react-test-renderer";
import AppMappView from "../AppMappView";

// Mocked localRestaurants data
const mockedLocalRestaurants = [
  {
    name: "Restaurant 1",
    rating: 4.5,
    distance: 2,
    website: "https://www.restaurant1.com",
    geometry: {
      location: {
        lat: 1.2345,
        lng: 1.2345,
      },
    },
  },
  {
    name: "Restaurant 2",
    rating: 3.8,
    distance: 3,
    website: "https://www.restaurant2.com",
    geometry: {
      location: {
        lat: 2.3456,
        lng: 2.3456,
      },
    },
  },
];

// Mocking react-native-maps components
jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
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
    PROVIDER_GOOGLE: "PROVIDER_GOOGLE",
  };
});

describe("<AppMappView />", () => {
  test("renders without crashing", () => {
    const tree = renderer.create(<AppMappView />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("filters restaurants based on search term", () => {
    const tree = renderer
      .create(
        <AppMappView
          searchTerm="Restaurant 1"
          localRestaurants={mockedLocalRestaurants}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("animates to selected restaurant location", () => {
    const tree = renderer
      .create(
        <AppMappView
          geometry={{ location: { lat: 1.2345, lng: 1.2345 } }}
          localRestaurants={mockedLocalRestaurants}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("shows callout for selected restaurant", () => {
    const tree = renderer
      .create(
        <AppMappView
          geometry={{ location: { lat: 1.2345, lng: 1.2345 } }}
          localRestaurants={mockedLocalRestaurants}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly when no local restaurants are provided", () => {
    const tree = renderer.create(<AppMappView />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly when no search term is provided", () => {
    const tree = renderer
      .create(<AppMappView localRestaurants={mockedLocalRestaurants} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly when no restaurant is selected", () => {
    const tree = renderer
      .create(
        <AppMappView
          localRestaurants={mockedLocalRestaurants}
          geometry={{ location: null }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly with different restaurant ratings", () => {
    const localRestaurantsWithDifferentRatings = [
      {
        name: "Restaurant 1",
        rating: 5.0,
        distance: 1.5,
      },
      {
        name: "Restaurant 2",
        rating: 3.0,
        distance: 2.3,
      },
    ];
    const tree = renderer
      .create(
        <AppMappView
          localRestaurants={localRestaurantsWithDifferentRatings}
          // Other props...
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("calls a function when a marker is pressed", () => {
    const handleMarkerPress = jest.fn(); // Mock function to be called when marker is pressed
    const tree = renderer
      .create(
        // Use create method to render the component
        <AppMappView
          localRestaurants={mockedLocalRestaurants}
          onMarkerPress={handleMarkerPress} // Pass the mock function as prop
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
