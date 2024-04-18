export interface Restaurant {
    geometry: {
        location: {
          lat: number;
          lng: number;
        };
      };    
    id: string;
    name: string;
    image: string | null;
    categories?: string[];
    price?: string;
    rating?: number;
    displayAddress?: string;
    phone?: string;
    distance: string;
    isClosed?: boolean;
    
    isFavourite?: boolean;
    isBookmarked?: boolean;
    isVisited?: boolean;
}