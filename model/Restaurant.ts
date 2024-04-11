export interface Restaurant {
    id: string;
    name: string;
    image: string | null;
    categories?: string[];
    price?: string;
    rating?: number;
    displayAddress?: string;
    phone?: string;
    distance: number;
    isClosed?: boolean;
    
    isFavourite?: boolean;
    isBookmarked?: boolean;
    isVisited?: boolean;
}