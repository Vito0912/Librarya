import { MediaType } from "@/database/utils/types/mediaTypes";
import { Knex } from "knex";
import { ResponseData } from "../responseData";

export interface RatingModel {
    id?: number;
    rating: number;
    type: number | MediaType;
}

export interface RatingLinkModel {
    id?: number;
    rating_id: number;
    media_id: number;
}

export async function createRatingDBs(db: Knex<any, unknown[]>) {
    return {rating_id: await createRatingDB(db), rating_link_id: await createRatingLinkDB(db)}
}

export async function createRatingLinkDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('rating_link'))) {
        return await db.schema.createTable('rating_link', table => {
            table.increments('id').primary();
            table.integer('rating_id');
            table.integer('media_id');
        });
    }
}

export async function createRatingDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('rating'))) {
        return await db.schema.createTable('rating', table => {
            table.increments('id').primary();
            table.integer('rating');
            table.integer('type');
        });
    }
}

export async function dropRatingDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('rating');
}

export async function dropRatingLinkDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('rating_link');
}

export async function dropRatingDBs(db: Knex<any, unknown[]>) {
    return {rating: await dropRatingDB(db), rating_link: await dropRatingLinkDB(db)}
}

export async function insertRating(db: Knex<any, unknown[]>, rating: RatingModel): Promise<ResponseData> {
    const { id, ...ratingWithoutId } = rating;

    const ratingExists = await db('rating').where({ rating: ratingWithoutId.rating }).first();

    if(ratingExists) return {statusCode: 409, error: 'Rating already exists'}

    return {statusCode: 200, data: await db('rating').insert(ratingWithoutId)};
}

export async function insertRatingLink(db: Knex<any, unknown[]>, ratingLink: RatingLinkModel): Promise<ResponseData> {
    const { id, ...ratingLinkWithoutId } = ratingLink;

    if(!ratingLinkWithoutId.rating_id) return {statusCode: 400, error: 'Rating id is required'}
    if(!ratingLinkWithoutId.media_id) return {statusCode: 400, error: 'Media id is required'}

    const ratingExists = await db('rating').where({ id: ratingLinkWithoutId.rating_id }).first();

    if(!ratingExists) return {statusCode: 404, error: 'Rating not found'}

    const mediaExists = await db('media').where({ id: ratingLinkWithoutId.media_id }).first();

    if(!mediaExists) return {statusCode: 404, error: 'Media not found'}

    const ratingLinkExists = await db('rating_link').where({ rating_id: ratingLinkWithoutId.rating_id, media_id: ratingLinkWithoutId.media_id }).first();

    if(ratingLinkExists) return {statusCode: 409, error: 'Rating link already exists'}

    return{ statusCode: 200, data: await db('rating_link').insert(ratingLinkWithoutId)};
}

export async function insertRatingFull(db: Knex<any, unknown[]>, rating: RatingModel, media_id: number): Promise<ResponseData> {
    const { id, ...ratingWithoutId } = rating;

    let ratingExists = await db('rating').where({ rating: ratingWithoutId.rating }).first();
    let rating_id = null;

    if(!ratingExists) {
        const ratingInsertResult = await insertRating(db, rating);
        if(ratingInsertResult.statusCode !== 200) return ratingInsertResult;
        rating_id = ratingInsertResult.data[0];
    }

    if(rating_id === null) rating_id = ratingExists.id;

    const ratingLink1 = await insertRatingLink(db, {rating_id: rating_id, media_id: media_id});

    return ratingLink1;
}

export async function getRatingById(db: Knex<any, unknown[]>, rating_id: number): Promise<ResponseData> {
    const rating = await db('rating').where({ id: rating_id }).first();

    if(!rating) return {statusCode: 404, error: 'Rating not found'}

    return {statusCode: 200, data: rating};
}

export async function getRatingsByMediaId(db: Knex<any, unknown[]>, media_id: number): Promise<ResponseData> {
    const ratingLinks = await db('rating_link').where({ media_id: media_id });

    if(ratingLinks.length === 0) return {statusCode: 404, error: 'No ratings found'}

    const ratings: RatingModel[] = [];

    for (const ratingLink of ratingLinks) {
        const rating = await getRatingById(db, ratingLink.rating_id);
        if(rating.statusCode !== 200) return rating;
        ratings.push(rating.data);
    }

    return {statusCode: 200, data: ratings};
}
