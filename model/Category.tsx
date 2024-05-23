export interface Category {
    id: number;
    name: string;
    tags?: string[];
    image?: string;
    type: string;
    apiName: string;
    scale?: number;
}