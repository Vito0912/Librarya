import { MediaType } from "../utils/types/mediaTypes";
import { AuthorModel } from "./authorModel";
import { IdentifierModel } from "./identifierModel";
import { SeriesModel } from "./seriesModel";

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

    creationDate?: number;
    modificationDate?: number;
    publishedDate?: number;

    hasCover?: boolean;

    sort?: string;
}