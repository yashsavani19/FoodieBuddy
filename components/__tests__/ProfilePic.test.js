import React from "react";
import { render } from "@testing-library/react-native";

jest.mock('react', () => ({
  useState: jest.fn(),
  useEffect: jest.fn(),
  useContext: jest.fn(),
  createElement: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

const mockAppContext = {
  bookmarkedRestaurants: [],
  favouriteRestaurants: [],
  visitedRestaurants: [],
  preferences: {},
};

const mockAuthContext = {
  user: { uid: '123', displayName: 'Test User' },
  signOut: jest.fn(),
};

// const UserProfileView = require("app/(tabs)/ProfileView/UserProfileView");

describe('UserProfileView', () => {
  let mockRender;

  beforeEach(() => {
    mockRender = jest.fn();
    react.createElement.mockReturnValueOnce({ render: mockRender });
  });

  it('renders correctly and opens modal on camera icon click', () => {
    const { useState, useEffect, useContext } = jest.fn();
    useState.mockReturnValueOnce(['test-url', jest.fn()]); // Mock selectedImage and setter
    useContext.mockReturnValueOnce(mockAppContext);
    useContext.mockReturnValueOnce(mockAuthContext);

    UserProfileView();

    expect(mockRender).toHaveBeenCalled();
    expect(useState).toHaveBeenCalledTimes(5); // Including isModalVisible, etc.
    expect(useContext).toHaveBeenCalledTimes(2); // AppContext and AuthContext

    // Simulate clicking the camera icon
    mockRender.mockReturnValueOnce({ getByTestId: jest.fn() });
    const getByTestId = jest.fn().mockReturnValue({ onPress: jest.fn() });
    mockRender.mockReturnValueOnce({ getByTestId });
    const { getByTestId: mockGetByTestId } = mockRender.mock.results[1].value;
    mockGetByTestId('camera-icon').onPress();

    expect(mockGetByTestId).toHaveBeenCalledWith('camera-icon');
    //  Further assertions on modal content can be added here
  });
});
