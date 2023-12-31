import { MediaType } from "../utils/types/mediaTypes";

export interface LanguageModel {
    id: number;
    lang_name: string;	
    lang_code: string;
    type: MediaType;
}