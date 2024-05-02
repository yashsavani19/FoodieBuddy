import React, { useContext } from "react";
import { GOOGLE_API_KEY } from "@env";
import axios from "axios";
import { Restaurant } from "@/model/Restaurant";
import { getDistanceFromLatLonInKm } from "@/app/Utils/distanceCalculator";
import { AppContext } from "@/context/AppContext";

export async function getRestaurantById(placeId: string, location: any) {
  console.log("Fetching restaurant with placeId:", placeId);
  const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?fields=website,geometry,name,photos,price_level,rating,formatted_address,formatted_phone_number,business_status&place_id=${placeId}&key=${GOOGLE_API_KEY}`;
  const response = await axios.get<any>(apiUrl);
  const result = response.data.result || null;
  const photoWidth = 700;
  const photoHeight = 700;

  // Construct URL for the restaurant's main photo if available
  const photoUrl =
    result.photos && result.photos[0] && result.photos[0].photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${photoWidth}&maxheight=${photoHeight}&photo_reference=${result.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
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
    geometry: result.geometry,
    id: result.place_id,
    name: result.name,
    image: photoUrl || "",
    categories: result.types,
    price: result.price_level,
    rating: result.rating,
    displayAddress: result.vicinity,
    phone: result.formatted_phone_number,
    distance: distance.toFixed(2),
    isClosed: result.business_status,
    website: result.website,
  };

  console.log("Restaurant fetched:", restaurant);

  return restaurant;
}
