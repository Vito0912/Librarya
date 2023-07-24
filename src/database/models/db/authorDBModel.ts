import { Knex } from "knex";
import { ResponseData } from "../responseData";

export interface AuthorDBModel {
    id?: number;
    name: string;
    sort?: string;
}

export interface AuthorLinkModel {
    id?: number;
    author_id: number;
    media_id: number;
}

export async function createAuthorDBs(db: Knex<any, unknown[]>) {
    return {author_id: await createAutorDB(db), author_link_id: await createAuthorLinkDB(db)}
}

export async function createAuthorLinkDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('author_link'))) {
        return await db.schema.createTable('author_link', table => {
            table.increments('id').primary();
            table.integer('author_id');
            table.integer('media_id');
        });
    }
}

export async function createAutorDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('author'))) {
        return await db.schema.createTable('author', table => {
            table.increments('id').primary();
            table.string('name');
            table.string('sort');
        });
    }
}

export async function dropAuthorDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('author');
}

export async function dropAuthorLinkDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('author_link');
}

export async function dropAuthorDBs(db: Knex<any, unknown[]>) {
    return {author: await dropAuthorDB(db), author_link: await dropAuthorLinkDB(db)}
}

export async function insertAuthor(db: Knex<any, unknown[]>, author: AuthorDBModel): Promise<ResponseData> {
    const { id, ...authorWithoutId } = author;

    const authorExists = await db('author').where({ name: authorWithoutId.name }).first();

    if(authorExists) return {statusCode: 409, error: 'Author already exists'}

    return {statusCode: 200, data: await db('author').insert(authorWithoutId)};
}

export async function insertAuthorLink(db: Knex<any, unknown[]>, authorLink: AuthorLinkModel): Promise<ResponseData> {
    const { id, ...authorLinkWithoutId } = authorLink;

    if(!authorLinkWithoutId.author_id) return {statusCode: 400, error: 'Author id is required'}
    if(!authorLinkWithoutId.media_id) return {statusCode: 400, error: 'Media id is required'}

    const authorExists = await db('author').where({ id: authorLinkWithoutId.author_id }).first();

    if(!authorExists) return {statusCode: 404, error: 'Author not found'}

    const mediaExists = await db('media').where({ id: authorLinkWithoutId.media_id }).first();

    if(!mediaExists) return {statusCode: 404, error: 'Media not found'}

    const authorLinkExists = await db('author_link').where({ author_id: authorLinkWithoutId.author_id, media_id: authorLinkWithoutId.media_id }).first();

    if(authorLinkExists) return {statusCode: 409, error: 'Author link already exists'}

    return{ statusCode: 200, data: await db('author_link').insert(authorLinkWithoutId)};
}

export async function insertAuthorFull(db: Knex<any, unknown[]>, author: AuthorDBModel, media_id: number): Promise<ResponseData> {
    const { id, ...authorWithoutId } = author;

    let authorExists = await db('author').where({ name: authorWithoutId.name }).first();
    let author_id = null;

    if(!authorExists) {
        const authorInsertResult = await insertAuthor(db, author);
        if(authorInsertResult.statusCode !== 200) return authorInsertResult;
        author_id = authorInsertResult.data[0];
    }

    if(author_id === null) author_id = authorExists.id;

    const authorLink1 = await insertAuthorLink(db, {author_id: author_id, media_id: media_id});

    return authorLink1;
}

export async function getAuthorById(db: Knex<any, unknown[]>, author_id: number): Promise<ResponseData> {
    const author = await db('author').where({ id: author_id }).first();

    if(!author) return {statusCode: 404, error: 'Author not found'}

    return {statusCode: 200, data: author};
}

export async function getAuthorsByMediaId(db: Knex<any, unknown[]>, media_id: number): Promise<ResponseData> {
    const authorLinks = await db('author_link').where({ media_id: media_id });

    if(authorLinks.length === 0) return {statusCode: 404, error: 'No authors found'}

    const authors: AuthorDBModel[] = [];

    for (const authorLink of authorLinks) {
        const author = await getAuthorById(db, authorLink.author_id);
        if(author.statusCode !== 200) return author;
        authors.push(author.data);
    }

    return {statusCode: 200, data: authors};
}