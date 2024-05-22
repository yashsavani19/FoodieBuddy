import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ImFeelingLucky from "../ImFeelingLucky"; // adjust the import path as necessary
import { AppContext } from "@/context/AppContext";
import { NavigationContainer } from "@react-navigation/native";
import { Restaurant } from "@/model/Restaurant";

// Mocking the navigation
const mockNavigate = jest.fn();

jest.mock("expo-router", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe("ImFeelingLucky component", () => {
  it("navigates to DetailsView with a random restaurant when pressed", () => {
    const localRestaurants: Restaurant[] = [
      {
        website: "http://restaurant1.com",
        geometry: { location: { lat: 40.7128, lng: -74.006 } },
        id: "1",
        name: "Restaurant 1",
        image: "image1.jpg",
        distance: "1 mile",
      },
      {
        website: "http://restaurant2.com",
        geometry: { location: { lat: 40.7128, lng: -74.0061 } },
        id: "2",
        name: "Restaurant 2",
        image: "image2.jpg",
        distance: "2 miles",
      },
      {
        website: "http://restaurant3.com",
        geometry: { location: { lat: 40.7128, lng: -74.0062 } },
        id: "3",
        name: "Restaurant 3",
        image: "image3.jpg",
        distance: "3 miles",
      },
    ];

    const { getByTestId } = render(
      <NavigationContainer>
        <AppContext.Provider value={{ localRestaurants }}>
          <ImFeelingLucky>
            <Text>{I'm Feeling Lucky}</Text>
          </ImFeelingLucky>
        </AppContext.Provider>
      </NavigationContainer>
    );

    const pressable = getByTestId("lucky-button");
    fireEvent.press(pressable);

    const randomRestaurant = localRestaurants.find(
      (restaurant) =>
        mockNavigate.mock.calls[0][1].Restaurant.id === restaurant.id
    );

    expect(mockNavigate).toHaveBeenCalledWith("DetailsView", {
      Restaurant: expect.objectContaining({
        website: expect.any(String),
        geometry: expect.any(Object),
        id: expect.any(String),
        name: expect.any(String),
        image: expect.any(String),
        distance: expect.any(String),
      }),
    });
    expect(randomRestaurant).toBeDefined();
  });
});
