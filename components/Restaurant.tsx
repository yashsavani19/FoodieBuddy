interface Restaurant {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  rating: number;
  image: string; // New property for the restaurant's image URL
}