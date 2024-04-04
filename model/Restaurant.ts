export interface Restaurant {
    id: string;
    name: string;
    imageUrl: string;
    categories: string[];
    price: string;
    rating: number;
    reviewCount: number;
    displayAddress: string;
    phone: string;
    distance: number;
    isClosed: boolean;
}