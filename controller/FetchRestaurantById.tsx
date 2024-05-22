import React, { useContext } from "react";
import { GOOGLE_API_KEY } from "@env";
import axios from "axios";
import { Restaurant } from "@/model/Restaurant";
import { getDistanceFromLatLonInKm } from "@/app/Utils/distanceCalculator";
import { AppContext } from "@/context/AppContext";

export async function getRestaurantById(placeId: string, location: any) {
  console.log("Fetching restaurant with placeId:", placeId);

  const detailsApiUrl = `https://places.googleapis.com/v1/places/${placeId}`;    
  
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': GOOGLE_API_KEY, 
    'X-Goog-FieldMask': 'websiteUri,location,displayName,photos,priceLevel,rating,formattedAddress,nationalPhoneNumber,businessStatus,types',
  };

  const response = await axios.get<any>(detailsApiUrl, { headers });
  const result = response.data || null;

  const photoWidth = 700;
  const photoHeight = 700;

  // TURN INTO FUNCTION FILE
  const priceLevel = result.priceLevel;
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

  // Construct URL for the restaurant's main photo if available
  const photoUrl = result.photos && result.photos[0] && result.photos[0].name
        ? `https://places.googleapis.com/v1/places/${result.id}/photos/${result.photos[0].name}/media?maxWidthPx=${photoWidth}&key=${GOOGLE_API_KEY}`
        : null;

  let distance = 0;
  if (location && result.geometry) {
    distance = getDistanceFromLatLonInKm(
      location.latitude,
      location.longitude,
      result.geometry.location.lat,
      result.geometry.location.lng
    );
  }

  const restaurant: Restaurant = {
    geometry: {
      location: {
        lat: result.location.latitude,
        lng: result.location.longitude
      },
    },
    id: result.id,
    name: result.displayName.text,
    image: photoUrl || "",
    categories: result.types,
    price: priceScale && priceScale.toString() || "0",
    rating: result.rating,
    displayAddress: result.formattedAddress,
    phone: result.nationalPhoneNumber,
    distance: distance.toFixed(2),
    isClosed: result.businessStatus,
    website: result.website,
  };

  console.log("Restaurant fetched:", restaurant);

  return restaurant;
}
