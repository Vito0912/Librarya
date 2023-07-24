import { Knex } from "knex";
import { ResponseData } from "../responseData";


export interface SeriesDBModel {
    id?: number;
    name: string;
    currentIndex?: number;
}

export interface SeriesLinkModel {
    id?: number;
    series_id: number;
    media_id: number;
}

export async function createSeriesDBs(db: Knex<any, unknown[]>) {
    return {series_id: await createSeriesDB(db), series_link_id: await createSeriesLinkDB(db)}
}

export async function createSeriesLinkDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('series_link'))) {
        return await db.schema.createTable('series_link', table => {
            table.increments('id').primary();
            table.integer('series_id');
            table.integer('media_id');
        });
    }
}

export async function createSeriesDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('series'))) {
        return await db.schema.createTable('series', table => {
            table.increments('id').primary();
            table.string('name');
            table.integer('currentIndex');
        });
    }
}

export async function dropSeriesDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('series');
}

export async function dropSeriesLinkDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('series_link');
}

export async function dropSeriesDBs(db: Knex<any, unknown[]>) {
    return {series: await dropSeriesDB(db), series_link: await dropSeriesLinkDB(db)}
}

export async function insertSeries(db: Knex<any, unknown[]>, series: SeriesDBModel): Promise<ResponseData> {
    const { id, ...seriesWithoutId } = series;

    const seriesExists = await db('series').where({ name: seriesWithoutId.name }).first();

    if(seriesExists) return {statusCode: 409, error: 'Series already exists'}

    return {statusCode: 200, data: await db('series').insert(seriesWithoutId)};
}

export async function insertSeriesLink(db: Knex<any, unknown[]>, seriesLink: SeriesLinkModel): Promise<ResponseData> {
    const { id, ...seriesLinkWithoutId } = seriesLink;

    if(!seriesLinkWithoutId.series_id) return {statusCode: 400, error: 'Series id is required'}
    if(!seriesLinkWithoutId.media_id) return {statusCode: 400, error: 'Media id is required'}

    const seriesExists = await db('series').where({ id: seriesLinkWithoutId.series_id }).first();

    if(!seriesExists) return {statusCode: 404, error: 'Series not found'}

    const mediaExists = await db('media').where({ id: seriesLinkWithoutId.media_id }).first();

    if(!mediaExists) return {statusCode: 404, error: 'Media not found'}

    const seriesLinkExists = await db('series_link').where({ series_id: seriesLinkWithoutId.series_id, media_id: seriesLinkWithoutId.media_id }).first();

    if(seriesLinkExists) return {statusCode: 409, error: 'Series link already exists'}

    return{ statusCode: 200, data: await db('series_link').insert(seriesLinkWithoutId)};
}

export async function insertSeriesFull(db: Knex<any, unknown[]>, series: SeriesDBModel, media_id: number): Promise<ResponseData> {
    const { id, ...seriesWithoutId } = series;

    let seriesExists = await db('series').where({ name: seriesWithoutId.name }).first();
    let series_id = null;

    if(!seriesExists) {
        const seriesInsertResult = await insertSeries(db, series);
        if(seriesInsertResult.statusCode !== 200) return seriesInsertResult;
        series_id = seriesInsertResult.data[0];
    }

    if(series_id === null) series_id = seriesExists.id;

    const seriesLink1 = await insertSeriesLink(db, {series_id: series_id, media_id: media_id});

    return seriesLink1;
}

export async function getSeriesById(db: Knex<any, unknown[]>, series_id: number): Promise<ResponseData> {
    const series = await db('series').where({ id: series_id }).first();

    if(!series) return {statusCode: 404, error: 'Series not found'}

    return {statusCode: 200, data: series};
}

export async function getSeriesByMediaId(db: Knex<any, unknown[]>, media_id: number): Promise<ResponseData> {
    const seriesLinks = await db('series_link').where({ media_id: media_id });

    if(seriesLinks.length === 0) return {statusCode: 404, error: 'No series found'}

    const series: SeriesDBModel[] = [];

    for (const seriesLink of seriesLinks) {
        const seriesResult = await getSeriesById(db, seriesLink.series_id);
        if(seriesResult.statusCode !== 200) return seriesResult;
        series.push(seriesResult.data);
    }

    return {statusCode: 200, data: series};
}