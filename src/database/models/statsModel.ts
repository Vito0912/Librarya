import { FileType } from "./enums/filetype";

export interface StatsModel {
    id?: number;
    file_type: FileType;
    file_size: number;
    download_count: number;
}