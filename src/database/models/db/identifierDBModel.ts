import { Knex } from "knex";
import { ResponseData } from "../responseData";

export interface IdentifierDBModel {
    id?: number;
    name: string;
    value: string | number;
}

export interface IdentifierLinkModel {
    id?: number;
    identifier_id: number;
    media_id: number;
}

export async function createIdentifierDBs(db: Knex<any, unknown[]>) {
    return {identifier_id: await createIdentifierDB(db), identifier_link_id: await createIdentifierLinkDB(db)}
}

export async function createIdentifierLinkDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('identifier_link'))) {
        return await db.schema.createTable('identifier_link', table => {
            table.increments('id').primary();
            table.integer('identifier_id');
            table.integer('media_id');
        });
    }
}

export async function createIdentifierDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('identifier'))) {
        return await db.schema.createTable('identifier', table => {
            table.increments('id').primary();
            table.string('name');
            table.string('value');
        });
    }
}

export async function dropIdentifierDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('identifier');
}

export async function dropIdentifierLinkDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('identifier_link');
}

export async function dropIdentifierDBs(db: Knex<any, unknown[]>) {
    return {identifier: await dropIdentifierDB(db), identifier_link: await dropIdentifierLinkDB(db)}
}

export async function insertIdentifier(db: Knex<any, unknown[]>, identifier: IdentifierDBModel): Promise<ResponseData> {
    const { id, ...identifierWithoutId } = identifier;

    const identifierExists = await db('identifier').where({ name: identifierWithoutId.name }).first();

    if(identifierExists) return {statusCode: 409, error: 'Identifier already exists'}

    return {statusCode: 200, data: await db('identifier').insert(identifierWithoutId)};
}

export async function insertIdentifierLink(db: Knex<any, unknown[]>, identifierLink: IdentifierLinkModel): Promise<ResponseData> {
    const { id, ...identifierLinkWithoutId } = identifierLink;

    if(!identifierLinkWithoutId.identifier_id) return {statusCode: 400, error: 'Identifier id is required'}
    if(!identifierLinkWithoutId.media_id) return {statusCode: 400, error: 'Media id is required'}

    const identifierExists = await db('identifier').where({ id: identifierLinkWithoutId.identifier_id }).first();

    if(!identifierExists) return {statusCode: 404, error: 'Identifier not found'}

    const mediaExists = await db('media').where({ id: identifierLinkWithoutId.media_id }).first();

    if(!mediaExists) return {statusCode: 404, error: 'Media not found'}

    const identifierLinkExists = await db('identifier_link').where({ identifier_id: identifierLinkWithoutId.identifier_id, media_id: identifierLinkWithoutId.media_id }).first();

    if(identifierLinkExists) return {statusCode: 409, error: 'Identifier link already exists'}

    return{ statusCode: 200, data: await db('identifier_link').insert(identifierLinkWithoutId)};
}

export async function insertIdentifierFull(db: Knex<any, unknown[]>, identifier: IdentifierDBModel, media_id: number): Promise<ResponseData> {
    const { id, ...identifierWithoutId } = identifier;

    let identifierExists = await db('identifier').where({ name: identifierWithoutId.name }).first();
    let identifier_id = null;

    if(!identifierExists) {
        const identifierInsertResult = await insertIdentifier(db, identifier);
        if(identifierInsertResult.statusCode !== 200) return identifierInsertResult;
        identifier_id = identifierInsertResult.data[0];
    }

    if(identifier_id === null) identifier_id = identifierExists.id;

    const identifierLink1 = await insertIdentifierLink(db, {identifier_id: identifier_id, media_id: media_id});

    return identifierLink1;
}

export async function getIdentifierById(db: Knex<any, unknown[]>, identifier_id: number): Promise<ResponseData> {
    const identifier = await db('identifier').where({ id: identifier_id }).first();

    if(!identifier) return {statusCode: 404, error: 'Identifier not found'}

    return {statusCode: 200, data: identifier};
}

export async function getIdentifiersByMediaId(db: Knex<any, unknown[]>, media_id: number): Promise<ResponseData> {
    const identifierLinks = await db('identifier_link').where({ media_id: media_id });

    if(identifierLinks.length === 0) return {statusCode: 404, error: 'No identifiers found'}

    const identifiers: IdentifierDBModel[] = [];

    for (const identifierLink of identifierLinks) {
        const identifier = await getIdentifierById(db, identifierLink.identifier_id);
        if(identifier.statusCode !== 200) return identifier;
        identifiers.push(identifier.data);
    }

    return {statusCode: 200, data: identifiers};
}
