import { Restaurant } from "./Restaurant";

export abstract class Saved {
    private placeId: string;
    private addedOn: Date;
    private restaurant: Restaurant;

    constructor(placeId: string, addedOn: Date, restaurant: Restaurant) {
        this.placeId = placeId;
        this.addedOn = addedOn;
        this.restaurant = restaurant;
    }

    getPlaceId(): string {
        return this.placeId;
    }

    getAddedOn(): Date {
        return this.addedOn;
    }

    getRestaurant(): Restaurant {
        return this.restaurant;
    }

    setPlaceId(placeId: string) {
        this.placeId = placeId;
    }

    setAddedOn(addedOn: Date) {
        this.addedOn = addedOn;
    }

    setRestaurant(restaurant: Restaurant) {
        this.restaurant = restaurant;
    }
};