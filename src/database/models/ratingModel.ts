import { MediaType } from "../utils/types/mediaTypes";

export interface RatingModel {
    id: number;
    rating: number;
    type: MediaType;
}