import { GOOGLE_API_KEY } from "@env"
import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places:searchNearby";
const API_KEY = GOOGLE_API_KEY;

const config={
  headers:{
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY,
    'X-Goog-FieldMask': [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.shortFormattedAddress',
      'places.photo',
      'places.currentOpeningHours',
      'places.regularOpeningHours',
      'places.nationalPhoneNumber',
      'places,priceLevel',
      'places.rating',
      'places,userRatingCount',
      'places,websiteUri',
      'places.goodForGroups',
      'places.reviews',
      'places.takeout',
      'places.delivery',
      'places.editorialSummary',
      'places.servesCoffee',
      'places.reservable',
      'places.dineIn',
      'places.paymentOptions',
      'places.parkingOptions',
      'places.restroom',
      'places.types'
    ]
  }
}

const NewNearByPlaces=(data: any)=>axios.post(BASE_URL, data, config);
export default{
  NewNearByPlaces
}
