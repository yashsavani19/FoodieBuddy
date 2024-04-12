import { Restaurant } from "./Restaurant";
import { Saved } from "./Saved";

export class Bookmark extends Saved {
  constructor(placeId: string, addedOn: Date, restaurant: Restaurant) {
    super(placeId, addedOn, restaurant);
  }
}
