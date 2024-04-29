// Import necessary libraries and components
import React from 'react';
import { render } from '@testing-library/react-native';
import RestaurantListItem from '@/components/RestaurantListItem'
import restaurants from '@/assets/data/restaurants'; 
import images from "@/assets/data/images";

// Mock the useNavigation hook
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('RestaurantListItem', () => {

    const mockRestaurant = restaurants[0];
    const mockRestaurantNoOptional = restaurants[10];

    it('Renders restaurant name correctly', () => {
        const { getByText } = render(<RestaurantListItem restaurant={mockRestaurant} />);
        expect(getByText(mockRestaurant.name)).toBeTruthy();
    });

    it('Renders restaurant distance correctly', () => {
        const { getByText } = render(<RestaurantListItem restaurant={mockRestaurant} />);
        expect(getByText(`${parseFloat(mockRestaurant.distance).toFixed(1)}km`)).toBeTruthy();
    });

    it('Renders restaurant rating correctly (if there is no rating)', () => {
        const { getByText } = render(<RestaurantListItem restaurant={mockRestaurantNoOptional} />);
        if (mockRestaurantNoOptional.rating === undefined) {
            expect(getByText("Rating: N/A")).toBeTruthy();
        }  
    });

    it('renders star rating correctly', () => {
        const { getAllByTestId } = render(<RestaurantListItem restaurant={mockRestaurant} />);
    
        // Calculate the expected number of full, half, and empty stars
        const fullStars = Math.floor(mockRestaurant.rating);
        const halfStars = mockRestaurant.rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;
    
        // Check if the correct number of full, half, and empty star icons are rendered
        expect(getAllByTestId('full-star').length).toBe(fullStars);
        expect(getAllByTestId('half-star').length).toBe(halfStars);
        expect(getAllByTestId('empty-star').length).toBe(emptyStars);
    });

    it('Renders restaurant default image correctly (when there is no image)', () => {
        const { getByTestId } = render(<RestaurantListItem restaurant={mockRestaurantNoOptional} />);
        expect(getByTestId('restaurant-image').props.source.uri).toBe(images.defaultRestaurantImage);
    });
  });