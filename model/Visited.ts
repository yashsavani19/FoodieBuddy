import { Restaurant } from "./Restaurant";
import { Saved } from "./Saved";

export class Visited extends Saved {
  constructor(placeId: string, addedOn: Date, restaurant: Restaurant) {
    super(placeId, addedOn, restaurant);
  }
}
