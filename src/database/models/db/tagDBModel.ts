import { Knex } from "knex";
import { ResponseData } from "../responseData";

export interface TagDBModel {
    id?: number;
    name: string;
}

export interface TagLinkModel {
    id?: number;
    tag_id: number;
    media_id: number;
}

export async function createTagDBs(db: Knex<any, unknown[]>) {
    return {tag_id: await createTagDB(db), tag_link_id: await createTagLinkDB(db)}
}

export async function createTagLinkDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('tag_link'))) {
        return await db.schema.createTable('tag_link', table => {
            table.increments('id').primary();
            table.integer('tag_id');
            table.integer('media_id');
        });
    }
}

export async function createTagDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('tag'))) {
        return await db.schema.createTable('tag', table => {
            table.increments('id').primary();
            table.string('name');
        });
    }
}

export async function dropTagDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('tag');
}

export async function dropTagLinkDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('tag_link');
}

export async function dropTagDBs(db: Knex<any, unknown[]>) {
    return {tag: await dropTagDB(db), tag_link: await dropTagLinkDB(db)}
}

export async function insertTag(db: Knex<any, unknown[]>, tag: TagDBModel): Promise<ResponseData> {
    const { id, ...tagWithoutId } = tag;

    const tagExists = await db('tag').where({ name: tagWithoutId.name }).first();

    if(tagExists) return {statusCode: 409, error: 'Tag already exists'}

    return {statusCode: 200, data: await db('tag').insert(tagWithoutId)};
}

export async function insertTagLink(db: Knex<any, unknown[]>, tagLink: TagLinkModel): Promise<ResponseData> {
    const { id, ...tagLinkWithoutId } = tagLink;

    if(!tagLinkWithoutId.tag_id) return {statusCode: 400, error: 'Tag id is required'}
    if(!tagLinkWithoutId.media_id) return {statusCode: 400, error: 'Media id is required'}

    const tagExists = await db('tag').where({ id: tagLinkWithoutId.tag_id }).first();

    if(!tagExists) return {statusCode: 404, error: 'Tag not found'}

    const mediaExists = await db('media').where({ id: tagLinkWithoutId.media_id }).first();

    if(!mediaExists) return {statusCode: 404, error: 'Media not found'}

    const tagLinkExists = await db('tag_link').where({ tag_id: tagLinkWithoutId.tag_id, media_id: tagLinkWithoutId.media_id }).first();

    if(tagLinkExists) return {statusCode: 409, error: 'Tag link already exists'}

    return{ statusCode: 200, data: await db('tag_link').insert(tagLinkWithoutId)};
}

export async function insertTagFull(db: Knex<any, unknown[]>, tag: TagDBModel, media_id: number): Promise<ResponseData> {
    const { id, ...tagWithoutId } = tag;

    let tagExists = await db('tag').where({ name: tagWithoutId.name }).first();
    let tag_id = null;

    if(!tagExists) {
        const tagInsertResult = await insertTag(db, tag);
        if(tagInsertResult.statusCode !== 200) return tagInsertResult;
        tag_id = tagInsertResult.data[0];
    }

    if(tag_id === null) tag_id = tagExists.id;

    const tagLink1 = await insertTagLink(db, {tag_id: tag_id, media_id: media_id});

    return tagLink1;
}

export async function getTagById(db: Knex<any, unknown[]>, tag_id: number): Promise<ResponseData> {
    const tag = await db('tag').where({ id: tag_id }).first();

    if(!tag) return {statusCode: 404, error: 'Tag not found'}

    return {statusCode: 200, data: tag};
}

export async function getTagsByMediaId(db: Knex<any, unknown[]>, media_id: number): Promise<ResponseData> {
    const tagLinks = await db('tag_link').where({ media_id: media_id });

    if(tagLinks.length === 0) return {statusCode: 404, error: 'No tags found'}

    const tags: TagDBModel[] = [];

    for (const tagLink of tagLinks) {
        const tag = await getTagById(db, tagLink.tag_id);
        if(tag.statusCode !== 200) return tag;
        tags.push(tag.data);
    }

    return {statusCode: 200, data: tags};
}
