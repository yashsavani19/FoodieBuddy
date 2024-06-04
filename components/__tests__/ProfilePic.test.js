import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserProfileView from 'ProfileView/UserProfileView'; // Adjust the import path accordingly
import { AppContext } from '../path/to/context/AppContext';
import { AuthContext } from '../path/to/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

// Mock the fetchUser function
jest.mock('../path/to/controller/ProfilePictureHandler', () => ({
  fetchUser: jest.fn().mockResolvedValue({ profileImageUrl: 'test-url' }),
}));

// Mock ImagePicker functions
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
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

describe('UserProfileView', () => {
  it('opens modal with camera, gallery, and remove options on camera icon click', async () => {
    const { getByTestId, getByText } = render(
      <AppContext.Provider value={mockAppContext}>
        <AuthContext.Provider value={mockAuthContext}>
          <UserProfileView />
        </AuthContext.Provider>
      </AppContext.Provider>
    );

    // Ensure the profile picture loads correctly
    await waitFor(() => {
      expect(getByTestId('profile-picture')).toHaveProp('source', { uri: 'test-url' });
    });

    // Find and click the camera icon
    const cameraIcon = getByTestId('camera-icon');
    fireEvent.press(cameraIcon);

    // Check if the modal options are displayed
    await waitFor(() => {
      expect(getByText('Camera')).toBeTruthy();
      expect(getByText('Gallery')).toBeTruthy();
      expect(getByText('Remove')).toBeTruthy();
    });
  });
});
