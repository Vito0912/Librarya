import { Knex } from "knex";
import { ResponseData } from "../responseData";

export interface LanguageDBModel {
    id?: number;
    lang_name: string;	
    lang_code: string;
    type: number;
}

export interface LanguageLinkModel {
    id?: number;
    language_id: number;
    media_id: number;
}

export async function createLanguageDBs(db: Knex<any, unknown[]>) {
    return {language_id: await createLanguageDB(db), language_link_id: await createLanguageLinkDB(db)}
}

export async function createLanguageLinkDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('language_link'))) {
        return await db.schema.createTable('language_link', table => {
            table.increments('id').primary();
            table.integer('language_id');
            table.integer('media_id');
        });
    }
}

export async function createLanguageDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('language'))) {
        return await db.schema.createTable('language', table => {
            table.increments('id').primary();
            table.string('lang_name');
            table.string('lang_code');
            table.integer('type');
        });
    }
}

export async function dropLanguageDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('language');
}

export async function dropLanguageLinkDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('language_link');
}

export async function dropLanguageDBs(db: Knex<any, unknown[]>) {
    return {language: await dropLanguageDB(db), language_link: await dropLanguageLinkDB(db)}
}

export async function insertLanguage(db: Knex<any, unknown[]>, language: LanguageDBModel): Promise<ResponseData> {
    const { id, ...languageWithoutId } = language;

    const languageExists = await db('language').where({ lang_name: languageWithoutId.lang_name }).first();

    if(languageExists) return {statusCode: 409, error: 'Language already exists'}

    return {statusCode: 200, data: await db('language').insert(languageWithoutId)};
}

export async function insertLanguageLink(db: Knex<any, unknown[]>, languageLink: LanguageLinkModel): Promise<ResponseData> {
    const { id, ...languageLinkWithoutId } = languageLink;

    if(!languageLinkWithoutId.language_id) return {statusCode: 400, error: 'Language id is required'}
    if(!languageLinkWithoutId.media_id) return {statusCode: 400, error: 'Media id is required'}

    const languageExists = await db('language').where({ id: languageLinkWithoutId.language_id }).first();

    if(!languageExists) return {statusCode: 404, error: 'Language not found'}

    const mediaExists = await db('media').where({ id: languageLinkWithoutId.media_id }).first();

    if(!mediaExists) return {statusCode: 404, error: 'Media not found'}

    const languageLinkExists = await db('language_link').where({ language_id: languageLinkWithoutId.language_id, media_id: languageLinkWithoutId.media_id }).first();

    if(languageLinkExists) return {statusCode: 409, error: 'Language link already exists'}

    return{ statusCode: 200, data: await db('language_link').insert(languageLinkWithoutId)};
}

export async function insertLanguageFull(db: Knex<any, unknown[]>, language: LanguageDBModel, media_id: number): Promise<ResponseData> {
    const { id, ...languageWithoutId } = language;

    let languageExists = await db('language').where({ lang_name: languageWithoutId.lang_name }).first();
    let language_id = null;

    if(!languageExists) {
        const languageInsertResult = await insertLanguage(db, language);
        if(languageInsertResult.statusCode !== 200) return languageInsertResult;
        language_id = languageInsertResult.data[0];
    }

    if(language_id === null) language_id = languageExists.id;

    const languageLink1 = await insertLanguageLink(db, {language_id: language_id, media_id: media_id});

    return languageLink1;
}

export async function getLanguageById(db: Knex<any, unknown[]>, language_id: number): Promise<ResponseData> {
    const language = await db('language').where({ id: language_id }).first();

    if(!language) return {statusCode: 404, error: 'Language not found'}

    return {statusCode: 200, data: language};
}

export async function getLanguagesByMediaId(db: Knex<any, unknown[]>, media_id: number): Promise<ResponseData> {
    const languageLinks = await db('language_link').where({ media_id: media_id });

    if(languageLinks.length === 0) return {statusCode: 404, error: 'No languages found'}

    const languages: LanguageDBModel[] = [];

    for (const languageLink of languageLinks) {
        const language = await getLanguageById(db, languageLink.language_id);
        if(language.statusCode !== 200) return language;
        languages.push(language.data);
    }

    return {statusCode: 200, data: languages};
}
