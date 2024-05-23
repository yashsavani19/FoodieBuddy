import { GOOGLE_API_KEY } from '@env';
import axios from 'axios';
import { getDistanceFromLatLonInKm } from '../app/Utils/distanceCalculator';
import { LocationObjectCoords } from 'expo-location';

// Configurable parameters for the API request
const photoWidth = 700;
const photoHeight = 700;
const searchRadius = 1050; // Search radius in meters
// Type of place to search
const placeTypes = [
  "american_restaurant",
  "bakery",
  "bar",
  "barbecue_restaurant",
  "brazilian_restaurant",
  "breakfast_restaurant",
  "brunch_restaurant",
  "cafe",
  "chinese_restaurant",
  "coffee_shop",
  "fast_food_restaurant",
  "french_restaurant",
  "greek_restaurant",
  "hamburger_restaurant",
  "ice_cream_shop",
  "indian_restaurant",
  "indonesian_restaurant",
  "italian_restaurant",
  "japanese_restaurant",
  "korean_restaurant",
  "lebanese_restaurant",
  "meal_delivery",
  "meal_takeaway",
  "mediterranean_restaurant",
  "mexican_restaurant",
  "middle_eastern_restaurant",
  "pizza_restaurant",
  "ramen_restaurant",
  "restaurant",
  "sandwich_shop",
  "seafood_restaurant",
  "spanish_restaurant",
  "steak_house",
  "sushi_restaurant",
  "thai_restaurant",
  "turkish_restaurant",
  "vegan_restaurant",
  "vegetarian_restaurant",
  "vietnamese_restaurant"
];

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

  try 
  {
    const results = await getRestaurantResults(location);

    const restaurants = await Promise.all(results.map(async (result: any) =>
    {
      // Construct URL for the restaurant's main photo if available
      const photoUrl = result.photos && result.photos[0] && result.photos[0].name
        ? `https://places.googleapis.com/v1/${result.photos[0].name}/media?maxWidthPx=${photoWidth}&maxHeightPx=${photoHeight}&key=${GOOGLE_API_KEY}`
        : null;

      const detailResults = await getRestaurantDetails(result.id);

      // Calculate the distance from the provided location to the restaurant
      const distance = getDistanceFromLatLonInKm(
        location.latitude,
        location.longitude,
        result.location.latitude,
        result.location.longitude
      )

        // Return restaurant data including photo URL
        return {
          geometry: {
            location: {
              lat: result.location.latitude,
              lng: result.location.longitude
            },
          },
          id: result.id,
          name: result.displayName.text,
          image: photoUrl,
          categories: result.types,
          price: detailResults.priceScale,
          rating: result.rating,
          displayAddress: result.formattedAddress,
          phone: result.nationalPhoneNumber,
          distance: distance.toFixed(2),
          isClosed: result.businessStatus,
          website: detailResults.websiteUrl,
        };
      })
    );

    //console.log("Fetched nearby restaurants:", restaurants.filter(restaurant => restaurant !== null));
    return restaurants.filter(restaurant => restaurant !== null);

    } 
     
    catch (error) {
    console.error("Error fetching nearby restaurants:", error);
    return [];
  }
};

/**
 * This method gets the nearby restaurants from Google Places API (new)
 * @param location 
 * @returns Array of Places objects
 */
async function getRestaurantResults(location: LocationObjectCoords)
{
  const latitude = location.latitude;
  const longitude = location.longitude;

  console.log("Fetching nearby restaurants...");

  const data = {
    includedPrimaryTypes: placeTypes,
    locationRestriction: {
      circle: {
        center: {
          latitude,
          longitude,
        },
        radius: searchRadius,
      },
    },
  };
  
  let headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': GOOGLE_API_KEY, 
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.types,places.photos,places.rating,places.businessStatus,places.nationalPhoneNumber,places.location,places.id,places.currentOpeningHours',
  };
  
  const apiUrl = 'https://places.googleapis.com/v1/places:searchNearby';    

  const response = await axios.post(apiUrl, data, { headers });

  // Process each result to create restaurant data
  return response.data.places || [];
}

/**
 * This method gets the Details of a restaurant from Google Places API (new)
 * @param id 
 * @returns websiteUrl and priceScale
 */
async function getRestaurantDetails(id: string)
{
  // Fetch additional details about the place: website URL and price level
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': GOOGLE_API_KEY, 
    'X-Goog-FieldMask': 'websiteUri,priceLevel',
  };
  
  const detailsApiUrl = `https://places.googleapis.com/v1/places/${id}`;    

  const detailsResponse = await axios.get(detailsApiUrl, { headers });
  
  const websiteUrl = detailsResponse.data.website;
  const priceLevel = detailsResponse.data.priceLevel;

  let priceScale = undefined;
  switch(priceLevel) 
  {
    case "PRICE_LEVEL_INEXPENSIVE":
      priceScale = 1;
      break;
    case "PRICE_LEVEL_MODERATE":
      priceScale = 2;
      break;
    case "PRICE_LEVEL_EXPENSIVE":
      priceScale = 3;
      break;
    case "PRICE_LEVEL_VERY_EXPENSIVE":
      priceScale = 4;
      break;
  }

  return { websiteUrl, priceScale };
}

export default fetchNearbyRestaurants;
