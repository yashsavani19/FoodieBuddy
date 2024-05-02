import { GOOGLE_API_KEY } from '@env';
import axios from 'axios';
import { getDistanceFromLatLonInKm } from '../app/Utils/distanceCalculator';
import { LocationObjectCoords } from 'expo-location';

// Configurable parameters for the API request
const photoWidth = 700;
const photoHeight = 700;
const searchRadius = 1050; // Search radius in meters
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
    // We want to exclude places that are not restaurants, such as cinemas
    const excludeKeywords = ["cinema"];
    //console.log("Response from API:", response.data);

    // Process each result to create restaurant data
    const results = response.data.results || [];
    const restaurants = await Promise.all(results.map(async (result: any) => {
      // Skip if the restaurant is not operational
      if (result.business_status !== 'OPERATIONAL') {
        return null;
      }

      // Exclude lodging (hotels, hostels, motels, etc.)
      if (result.types.includes('lodging')) {
        return null;
      }

      // Skip if the restaurant name contains any of the exclude keywords
      if (excludeKeywords.some(keyword => result.name.toLowerCase().includes(keyword))) {
        return null;
      }

      // Construct URL for the restaurant's main photo if available
      const photoUrl = result.photos && result.photos[0] && result.photos[0].photo_reference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${photoWidth}&maxheight=${photoHeight}&photo_reference=${result.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : null;

      // Fetch additional details about the place, including the website URL
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${result.place_id}&fields=website&key=${GOOGLE_API_KEY}`;
      const detailsResponse = await axios.get<any>(detailsUrl);
      const websiteUrl = detailsResponse.data.result && detailsResponse.data.result.website;

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
          website: websiteUrl,
        };
      })
    );

    //console.log("Fetched nearby restaurants:", restaurants.filter(restaurant => restaurant !== null));
    return restaurants.filter(restaurant => restaurant !== null);
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error);
    return [];
  }
};


export default fetchNearbyRestaurants;
