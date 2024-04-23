import { GOOGLE_API_KEY } from '@env';
import axios from 'axios';
import { getDistanceFromLatLonInKm } from '../app/Utils/distanceCalculator';
import { LocationObjectCoords } from 'expo-location';

// Configurable parameters for the API request
const photoWidth = 700;
const photoHeight = 700;
const searchRadius = 5000; // Search radius in meters
const placeType = 'restaurant'; // Type of place to search

/**
 * Fetches nearby restaurants based on the provided location.
 * @param location - The geographic coordinates where to look for restaurants.
 * @returns A promise that resolves to an array of restaurant objects.
 */
const fetchNearbyRestaurants = async (location: LocationObjectCoords | null): Promise<any[]> => {
  if (!location) {
    console.error("Location data is null.");
    return [];
  }

  try {
    console.log("Fetching nearby restaurants...");
    // Construct the API URL with query parameters
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${searchRadius}&type=${placeType}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get<any>(apiUrl);
    console.log("Response from API:", response.data);

    // Process each result to create restaurant data
    const results = response.data.results || [];
    const restaurants = await Promise.all(results.map(async (result: any) => {
      // Construct URL for the restaurant's main photo if available
      const photoUrl = result.photos && result.photos[0] && result.photos[0].photo_reference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${photoWidth}&maxheight=${photoHeight}&photo_reference=${result.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : null;

      // Calculate the distance from the provided location to the restaurant
      const distance = getDistanceFromLatLonInKm(
        location.latitude,
        location.longitude,
        result.geometry.location.lat,
        result.geometry.location.lng
      )

        // Return restaurant data including photo URL
        return {
          geometry: result.geometry,
          id: result.place_id,
          name: result.name,
          image: photoUrl,
          categories: result.types,
          price: result.price_level,
          rating: result.rating,
          displayAddress: result.vicinity,
          phone: result.formatted_phone_number,
          distance: distance.toFixed(2),
          isClosed: result.business_status,
        };
      })
    );

    return restaurants;
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error);
    return [];
  }
};

export default fetchNearbyRestaurants;
