import { MediaModel } from "./mediaModel";

export interface LibraryModel {
    id: number;
    name: string;
    description: string;
    media: MediaModel[];
}