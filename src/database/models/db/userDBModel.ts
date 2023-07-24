import { Knex } from "knex";

export interface UserModel {
    id?: number;
    username: string;
    firstname: string;
    lastname: string;
    mail: string;
    password: string;
    password_sync: string;
}

export function createUserDB(db: Knex<any, unknown[]>) {
    return db.schema.createTable('user', function (table) {
        table.increments('id').primary();
        table.string('username').notNullable();
        table.string('firstname').notNullable();
        table.string('lastname').notNullable();
        table.string('mail').notNullable();
        table.string('password').notNullable();
        table.string('password_sync').notNullable();
    });
}

export function dropUserDB(db: Knex<any, unknown[]>) {
    return db.schema.dropTable('user');
}

export async function insertUser(db: Knex<any, unknown[]>, user: UserModel) {
    const { id, ...userWithoutId } = user;

    const userExists = await db('user').orWhere({ username: userWithoutId.username, mail: userWithoutId.mail }).first();

    if(userExists) return {statusCode: 409, error: 'User already exists'}

    const user_id = await db('user').insert(userWithoutId);

    if(user_id === undefined || user_id[0] <= 0) return {statusCode: 500, error: 'User could not be created'}

    return {statusCode: 200, data: user_id[0]};
}

export async function getUserById(db: Knex<any, unknown[]>, id: number) {

    const userExists = await db('user').where({ id: id }).first();

    if(userExists) return {statusCode: 200, data: userExists}

    return {statusCode: 404, error: 'User not found'}
}

export async function getUserByIdentification(db: Knex<any, unknown[]>, ident: string) {

    const userExists = await db('user').orWhere({ username: ident, mail: ident }).first();

    if(userExists) return {statusCode: 200, data: userExists}

    return {statusCode: 404, error: 'User not found'}

}