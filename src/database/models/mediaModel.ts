import { MediaType } from "../utils/types/mediaTypes";
import { AuthorModel } from "./authorModel";
import { IdentifierModel } from "./identifierModel";
import { SeriesModel } from "./seriesModel";
import { TagModel } from "./tagModel";
import { RatingModel } from "./ratingModel";
import { LanguageModel } from "./languageModel";
import { PermissionModel } from "./permissionModel";

export interface MediaModel {
    id?: number;
    title: string;
    uuid: string;
    md5_filname: string;
    users: PermissionModel[];

    md5_binary?: string;

    path?: string;
    authors?: AuthorModel[];
    identifiers?: IdentifierModel[];
    series?: SeriesModel[];
    mediaType?: MediaType;
    tags?: TagModel[];
    ratings?: RatingModel[];
    languages?: LanguageModel[];

    creationDate?: number;
    modificationDate?: number;
    publishedDate?: number;

    hasCover?: boolean;

    sort?: string;
}