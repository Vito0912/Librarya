import { MediaType } from "../utils/types/mediaTypes";
import { AuthorModel } from "./authorModel";
import { IdentifierModel } from "./identifierModel";
import { SeriesModel } from "./seriesModel";
import { TagModel } from "./tagModel";
import { RatingModel } from "./ratingModel";
import { LanguageModel } from "./languageModel";

export interface MediaModel {
    id: number;
    title: string;
    uuid: string;
    md5_filname: string;

    md5_binary?: string;

    path?: string;
    author?: AuthorModel;
    identifier?: IdentifierModel[];
    series?: SeriesModel[];
    mediaType?: MediaType;
    tags?: TagModel[];
    rating?: RatingModel;
    language?: LanguageModel;

    creationDate?: number;
    modificationDate?: number;
    publishedDate?: number;

    hasCover?: boolean;

    sort?: string;
}