import { GOOGLE_API_KEY } from "@env"
import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places:searchNearby";
const API_KEY = GOOGLE_API_KEY;

const config={
  headers:{
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY,
    'X-Goog-FieldMask': '*'
  }
}

const NewNearByPlaces=(data: any)=>axios.post(BASE_URL, data, config);
export default{
  NewNearByPlaces
}
