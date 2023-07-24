import db from "../connect";
import {ResponseData} from "@/database/models/responseData";
import {MediaModel} from "@/database/models/mediaModel";

class MediaDB {

    async getBook(id: number): Promise<ResponseData> {
        const media = await db('media').where({id: id}).select('*');

        if(media == undefined) return { statusCode: 404, error: 'Media not found' };

        const mediaModel: MediaModel = {
            id: media.id,

        } 

        return { statusCode: 200, data: media };
    }

}