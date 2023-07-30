import { Knex } from "knex";
import { FileType } from "../enums/filetype";
import { ResponseData } from "../responseData";

export interface StatsDBModel {
    id?: number;
    file_type: FileType;
    file_size: number;
    download_count: number;
}

export interface StatsLinkModel {
    id?: number;
    stats_id: number;
    media_id: number;
}

export async function createStatsDBs(db: Knex<any, unknown[]>) {
    return {stats_id: await createStatsDB(db), stats_link_id: await createStatsLinkDB(db)}
}

export async function createStatsLinkDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('stats_link'))) {
        return await db.schema.createTable('stats_link', table => {
            table.increments('id').primary();
            table.integer('stats_id');
            table.integer('media_id');
        });
    }
}

export async function createStatsDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('stats'))) {
        return await db.schema.createTable('stats', table => {
            table.increments('id').primary();
            table.string('file_type');
            table.integer('file_size');
            table.integer('download_count');
        });
    }
}

export async function dropStatsDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('stats');
}

export async function dropStatsLinkDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('stats_link');
}

export async function dropStatsDBs(db: Knex<any, unknown[]>) {
    return {stats: await dropStatsDB(db), stats_link: await dropStatsLinkDB(db)}
}

export async function insertStats(db: Knex<any, unknown[]>, stats: StatsDBModel): Promise<ResponseData> {
    const { id, ...statsWithoutId } = stats;

    const statsExists = await db('stats').where({ file_type: statsWithoutId.file_type }).first();

    if(statsExists) return {statusCode: 409, error: 'Stats already exists'}

    return {statusCode: 200, data: await db('stats').insert(statsWithoutId)};
}

export async function insertStatsLink(db: Knex<any, unknown[]>, statsLink: StatsLinkModel): Promise<ResponseData> {
    const { id, ...statsLinkWithoutId } = statsLink;

    if(!statsLinkWithoutId.stats_id) return {statusCode: 400, error: 'Stats id is required'}
    if(!statsLinkWithoutId.media_id) return {statusCode: 400, error: 'Media id is required'}

    const statsExists = await db('stats').where({ id: statsLinkWithoutId.stats_id }).first();

    if(!statsExists) return {statusCode: 404, error: 'Stats not found'}

    const mediaExists = await db('media').where({ id: statsLinkWithoutId.media_id }).first();

    if(!mediaExists) return {statusCode: 404, error: 'Media not found'}

    const statsLinkExists = await db('stats_link').where({ stats_id: statsLinkWithoutId.stats_id, media_id: statsLinkWithoutId.media_id }).first();

    if(statsLinkExists) return {statusCode: 409, error: 'Stats link already exists'}

    return{ statusCode: 200, data: await db('stats_link').insert(statsLinkWithoutId)};
}

export async function insertStatsFull(db: Knex<any, unknown[]>, stats: StatsDBModel, media_id: number): Promise<ResponseData> {
    const { id, ...statsWithoutId } = stats;

    let statsExists = await db('stats').where({ file_type: statsWithoutId.file_type }).first();
    let stats_id = null;

    if(!statsExists) {
        const statsInsertResult = await insertStats(db, stats);
        if(statsInsertResult.statusCode !== 200) return statsInsertResult;
        stats_id = statsInsertResult.data[0];
    }

    if(stats_id === null) stats_id = statsExists.id;

    const statsLink1 = await insertStatsLink(db, {stats_id: stats_id, media_id: media_id});

    return statsLink1;
}

export async function getStatsById(db: Knex<any, unknown[]>, stats_id: number): Promise<ResponseData> {
    const stats = await db('stats').where({ id: stats_id }).first();

    if(!stats) return {statusCode: 404, error: 'Stats not found'}

    return {statusCode: 200, data: stats};
}

export async function getStatsByMediaId(db: Knex<any, unknown[]>, media_id: number): Promise<ResponseData> {
    const statsLinks = await db('stats_link').where({ media_id: media_id });

    if(statsLinks.length === 0) return {statusCode: 404, error: 'No stats found'}

    const stats: StatsDBModel[] = [];

    for (const statsLink of statsLinks) {
        const stat = await getStatsById(db, statsLink.stats_id);
        if(stat.statusCode !== 200) return stat;
        stats.push(stat.data);
    }

    return {statusCode: 200, data: stats};
}