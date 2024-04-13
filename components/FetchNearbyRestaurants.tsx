import { GOOGLE_API_KEY } from '@env';
import axios from 'axios';

const fetchNearbyRestaurants = async (latitude: number, longitude: number): Promise<any[]> => {
  try {
    console.log("Fetching nearby restaurants...");
    const response = await axios.get<any>(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=restaurant&key=${GOOGLE_API_KEY}`
    );
    console.log("Response from API:", response.data);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error);
    return [];
  }
};

export default fetchNearbyRestaurants;
