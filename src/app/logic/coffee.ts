import { PlaceLocation } from "./place-location";
import { TastingRating } from "./tasting-rating";

export class Coffee {
  _id!: any;
  type!: string;
  rating!: number;
  notes!: string;

  constructor(
    public name: string = '',
    public place: string = '',
    public location: PlaceLocation = new PlaceLocation(),
    public tastingRating: TastingRating | null = new TastingRating()
  ) { }
}
