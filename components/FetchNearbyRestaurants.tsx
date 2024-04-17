import { GOOGLE_API_KEY } from '@env';
import axios from 'axios';
import { getDistanceFromLatLonInKm } from '../app/Utils/distanceCalculator';

// Update the fetchNearbyRestaurants function to construct the photo URL
const fetchNearbyRestaurants = async (latitude: number, longitude: number): Promise<any[]> => {
  try {
    console.log("Fetching nearby restaurants...");
    const response = await axios.get<any>(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=restaurant&key=${GOOGLE_API_KEY}`
    );
    console.log("Response from API:", response.data);

    // Check if results are returned
    const results = response.data.results || [];
    const restaurants = await Promise.all(results.map(async (result: any) => {
      // Fetch the photo URL for each restaurant
      const photoUrl = result.photos && result.photos[0] && result.photos[0].photo_reference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&maxheight=300&photo_reference=${result.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : null;

        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          result.geometry.location.lat,
          result.geometry.location.lng
        );

      // Return restaurant data including photo URL
      return {
        geometry: result.geometry,
        name: result.name,
        rating: result.rating,
        image: photoUrl, 
        distance: distance.toFixed(2)
      };
    }));

    return restaurants;
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error);
    return [];
  }
};


export default fetchNearbyRestaurants;