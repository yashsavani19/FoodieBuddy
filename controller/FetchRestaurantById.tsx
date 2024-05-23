import { Restaurant } from "@/model/Restaurant";
import { getDistanceFromLatLonInKm } from "@/app/Utils/distanceCalculator";
import { getRestaurantDetails, getPhotoUrl } from "./FetchNearbyRestaurants";

export async function getRestaurantById(placeId: string, location: any) {
  console.log("Fetching restaurant with placeId:", placeId);

  const result = await getRestaurantDetails(placeId, true);

  // Construct URL for the restaurant's main photo if available
  const photoUrl = getPhotoUrl(result.data);

  let distance = 0;
  if (location && result.data.geometry) {
    distance = getDistanceFromLatLonInKm(
      location.latitude,
      location.longitude,
      result.data.geometry.location.lat,
      result.data.geometry.location.lng
    );
  }

  const restaurant: Restaurant = {
    geometry: {
      location: {
        lat: result.data.location.latitude,
        lng: result.data.location.longitude
      },
    },
    id: result.data.id,
    name: result.data.displayName.text,
    image: photoUrl || "",
    categories: result.data.types,
    price: result.priceScale && result.priceScale.toString() || "0",
    rating: result.data.rating,
    displayAddress: result.data.formattedAddress,
    phone: result.data.nationalPhoneNumber,
    distance: distance.toFixed(2),
    isClosed: result.data.businessStatus,
    website: result.data.website,
  };

  console.log("Restaurant fetched:", restaurant);

  return restaurant;
}
