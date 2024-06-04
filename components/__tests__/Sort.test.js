import React from 'react';
import { render } from '@testing-library/react-native';
import { TouchableOpacity } from 'react-native'; 

jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => {
    const realStyleSheet = jest.requireActual(
        "react-native/Libraries/StyleSheet/StyleSheet"
      );
      return {
        ...realStyleSheet,
        create: jest.fn().mockImplementation((styles) => styles),
        compose: jest
          .fn()
          .mockImplementation((style1, style2) => ({ ...style1, ...style2 })),
      };
});

const mockedRestaurants = [
    {
      id: "1",
      name: "Burger Place",
      price: "1",
      rating: 4.5,
      distance: "500",
      preferenceScore: 3
    },
    {
      id: "2",
      name: "Pasta House",
      price: "4",
      rating: 4.0,
      distance: "900",
      preferenceScore: 2
    },
    {
      id: "3",
      name: "Sushi Spot",
      price: "2",
      rating: 5.0,
      distance: "300",
      preferenceScore: 4
    },
    {
      id: "4",
      name: "Steak House",
      price: "3",
      rating: 3.5,
      distance: "700",
      preferenceScore: 1
    },
    {
      id: "5",
      name: "Cafe Delight",
      price: "5",
      rating: 4.5,
      distance: "200",
      preferenceScore: 5
    },
    {
      id: "6",
      name: "Pizza Heaven",
      price: "5",
      rating: 3.8,
      distance: "400",
      preferenceScore: 6
    }
  ];

describe('Sort', () => {

    it('should sort restaurants by preference score', () => {
            const sortedRestaurants = sortRestaurants(mockedRestaurants, "Preference");
            expect(sortedRestaurants[0].name).toBe("Pizza Heaven");
            expect(sortedRestaurants[1].name).toBe("Cafe Delight");
            expect(sortedRestaurants[2].name).toBe("Sushi Spot");
            expect(sortedRestaurants[3].name).toBe("Burger Place");
            expect(sortedRestaurants[4].name).toBe("Pasta House");
            expect(sortedRestaurants[5].name).toBe("Steak House");
            
    });

      it('should sort restaurants by price: high to low', () => {
    const sortedRestaurants = sortRestaurants(mockedRestaurants, "Price: High to Low");
    expect(sortedRestaurants[2].name).toBe("Pasta House");
    expect(sortedRestaurants[3].name).toBe("Steak House");
    expect(sortedRestaurants[4].name).toBe("Sushi Spot");
    expect(sortedRestaurants[1].name).toBe("Pizza Heaven");
    expect(sortedRestaurants[5].name).toBe("Burger Place");
    expect(sortedRestaurants[0].name).toBe("Cafe Delight");
  });

  it('should sort restaurants by price: low to high', () => {
    const sortedRestaurants = sortRestaurants(mockedRestaurants, "Price: Low to High");
    expect(sortedRestaurants[0].name).toBe("Burger Place");
    expect(sortedRestaurants[1].name).toBe("Sushi Spot");
    expect(sortedRestaurants[2].name).toBe("Steak House");
    expect(sortedRestaurants[3].name).toBe("Pasta House");
    expect(sortedRestaurants[4].name).toBe("Cafe Delight");
    expect(sortedRestaurants[5].name).toBe("Pizza Heaven");
  });


  it('should sort restaurants by rating: low to high', () => {
    const sortedRestaurants = sortRestaurants(mockedRestaurants, "Rating: Low to High");
    expect(sortedRestaurants[0].name).toBe("Steak House");
    expect(sortedRestaurants[1].name).toBe("Pizza Heaven");
    expect(sortedRestaurants[2].name).toBe("Pasta House");
    expect(sortedRestaurants[3].name).toBe("Cafe Delight");
    expect(sortedRestaurants[4].name).toBe("Burger Place");
    expect(sortedRestaurants[5].name).toBe("Sushi Spot");
  });

  it('should sort restaurants by rating: high to low', () => {
    const sortedRestaurants = sortRestaurants(mockedRestaurants, "Rating: High to Low");
    expect(sortedRestaurants[0].name).toBe("Sushi Spot");
    expect(sortedRestaurants[1].name).toBe("Cafe Delight");
    expect(sortedRestaurants[2].name).toBe("Burger Place");
    expect(sortedRestaurants[3].name).toBe("Pasta House");
    expect(sortedRestaurants[4].name).toBe("Pizza Heaven");
    expect(sortedRestaurants[5].name).toBe("Steak House");
  });

  it('should sort restaurants by distance: nearest', () => {
    const sortedRestaurants = sortRestaurants(mockedRestaurants, "Distance (Nearest)");
    expect(sortedRestaurants[0].name).toBe("Cafe Delight");
    expect(sortedRestaurants[1].name).toBe("Sushi Spot");
    expect(sortedRestaurants[2].name).toBe("Pizza Heaven");
    expect(sortedRestaurants[3].name).toBe("Burger Place");
    expect(sortedRestaurants[4].name).toBe("Steak House");
    expect(sortedRestaurants[5].name).toBe("Pasta House");
  });

  it('should sort restaurants by distance: farthest', () => {
    const sortedRestaurants = sortRestaurants(mockedRestaurants, "Distance (Farthest)");
    console.log(sortedRestaurants);
    expect(sortedRestaurants[0].name).toBe("Pasta House");
    expect(sortedRestaurants[1].name).toBe("Steak House");
    expect(sortedRestaurants[2].name).toBe("Burger Place");
    expect(sortedRestaurants[3].name).toBe("Pizza Heaven");
    expect(sortedRestaurants[4].name).toBe("Sushi Spot");
    expect(sortedRestaurants[5].name).toBe("Cafe Delight");
  });
});


function sortRestaurants(restaurants, sortOption) {
        let result = restaurants;
        switch (sortOption) {
          case "Preference":
            result = result.sort((a, b) => {
              if ((b.preferenceScore ?? 0) === (a.preferenceScore ?? 0)) {
                return a.distance.localeCompare(b.distance);
              }
              return (b.preferenceScore ?? 0) - (a.preferenceScore ?? 0);
            });
    
            break;
          case "Price: Low to High":
            result = result.sort((a, b) => {
                console.log(a.price," ", b.price);
              if (parseInt(a.price ?? "10") === parseInt(b.price ?? "10")) {
                return a.distance.localeCompare(b.distance);
              }
              return parseInt(a.price ?? "10") - parseInt(b.price ?? "10");
            });
            break;
          case "Price: High to Low":
            result = result.sort((a, b) => {
              if (parseInt(b.price ?? "0") === parseInt(a.price ?? "0")) {
                return a.distance.localeCompare(b.distance);
              }
              return parseInt(b.price ?? "0") - parseInt(a.price ?? "0");
            });
            break;
          case "Rating: High to Low":
            result = result.sort((a, b) => {
              if ((b.rating ?? 0) === (a.rating ?? 0)) {
                return a.distance.localeCompare(b.distance);
              }
              return (b.rating ?? 0) - (a.rating ?? 0);
            });
            break;
          case "Rating: Low to High":
            result = result.sort((a, b) => {
              if ((a.rating ?? 5) === (b.rating ?? 5)) {
                return a.distance.localeCompare(b.distance);
              }
              return (a.rating ?? 5) - (b.rating ?? 5);
            });
            break;
          case "A-Z":
            result = result.sort((a, b) => {
              if (a.name.localeCompare(b.name) === 0) {
                return a.distance.localeCompare(b.distance);
              }
              return a.name.localeCompare(b.name);
            });
            break;
          case "Z-A":
            result = result.sort((a, b) => {
              if (b.name.localeCompare(a.name) === 0) {
                return a.distance.localeCompare(b.distance);
              }
              return b.name.localeCompare(a.name);
            });
            break;
          case "Distance (Nearest)":
            result = result.sort((a, b) => a.distance.localeCompare(b.distance));
            break;
          case "Distance (Farthest)":
            result = result.sort((a, b) => b.distance.localeCompare(a.distance));
            break;
          default:
            result = result.sort((a, b) => {
              if (a.name.localeCompare(b.name) === 0) {
                return a.distance.localeCompare(b.distance);
              }
              return a.name.localeCompare(b.name);
            });
            break;
        }
        return result;
}
