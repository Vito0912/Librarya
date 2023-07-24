import { Knex } from "knex";
import { MediaModel } from "../mediaModel";
import { AuthorModel } from "../authorModel";
import { ResponseData } from "../responseData";
import { insertAuthorFull } from "./authorDBModel";

export interface MediaDBModel {
    id?: number;
    title: string;
    uuid: string;
    md5_filname: string;
    sort?: string;

    md5_binary?: string;


    path?: string;
    creationDate?: number;
    modificationDate?: number;
    publishedDate?: number;

    hasCover?: boolean;
    
}

export async function createMediaDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('media'))) {
        return await db.schema.createTable('media', table => {
            table.increments('id').primary();
            table.string('title');
            table.string('sort');
            table.string('uuid');
            table.string('md5_filname');
            table.string('md5_binary');
            table.string('path');
            table.timestamp('creationDate');
            table.timestamp('modificationDate');
            table.timestamp('publishedDate');
            table.boolean('hasCover');
        });
    }
}

export async function dropMediaDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('media');
}

export async function insertMediaDB(db: Knex<any, unknown[]>, media: MediaDBModel) {
    const { id, ...mediaWithoutId } = media;
    return await db('media').insert(mediaWithoutId);
}

export async function insertMediaToDB(db: Knex<any, unknown>, media: MediaModel): Promise<ResponseData> {
    const model = media;

    const authors: AuthorModel[] = model.authors || [];
    const identifiers = model.identifiers || [];
    const series = model.series || [];
    const mediaType = model.mediaType;
    const tags = model.tags || [];
    const ratings = model.ratings || [];
    const languages = model.languages || [];

    const mediaId = await insertMediaDB(db, {
        title: model.title,
        uuid: model.uuid,
        md5_filname: model.md5_filname,
        sort: model.sort,
        md5_binary: model.md5_binary,
        path: model.path,
        creationDate: model.creationDate,
        modificationDate: model.modificationDate,
        publishedDate: model.publishedDate,
        hasCover: model.hasCover,
    });

    if(mediaId.length <= 0) return { statusCode: 500, error: 'Error inserting media' };

    for (const author of authors) {
        let result = await insertAuthorFull(db, {
            name: author.name,
            sort: author.sort,
        },
        mediaId[0]);
        if(result.statusCode !== 200) console.log(result);
        if(result.statusCode !== 200) return result;
    }

    return { statusCode: 200, data: mediaId[0]};
}