// UserLocationContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import { LocationObjectCoords } from 'expo-location';

// Define the context's value type
interface UserLocationContextType {
  location: LocationObjectCoords | null;
  setLocation: (location: LocationObjectCoords | null) => void;
};

// Create the context with the correct default value
export const UserLocationContext = createContext<UserLocationContextType>({
  location: null,
  setLocation: () => {}, // Placeholder function
});

// Define the interface for the props of the UserLocationProvider component
interface UserLocationProviderProps {
  children: ReactNode; // This type can be ReactNode, ReactElement, JSX.Element, etc., based on your preference
};

export const UserLocationProvider: React.FC<UserLocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      // Pass only the coords to setLocation
      setLocation(location.coords);
    })();
  }, []);

  return (
    <UserLocationContext.Provider value={{ location, setLocation }}>
      {children}
    </UserLocationContext.Provider>
  );
};
