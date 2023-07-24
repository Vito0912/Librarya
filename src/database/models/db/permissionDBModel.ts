import { Knex } from "knex";
import { ResponseData } from "../responseData";
import UserModel from "../userModel";
import { getUserById } from "./userDBModel";
import { PermissionModel } from "../permissionModel";

export interface PermissionDBModel {
    id?: number;
    user: number;
    permission: number;
}

export interface PermissionLinkModel {
    id?: number;
    permission_id: number;
    media_id: number;
}

export async function createPermissionDBs(db: Knex<any, unknown[]>) {
    return {permission_id: await createPermissionDB(db), permission_link_id: await createPermissionLinkDB(db)}
}

export async function createPermissionLinkDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('permission_link'))) {
        return await db.schema.createTable('permission_link', table => {
            table.increments('id').primary();
            table.integer('permission_id');
            table.integer('media_id');
        });
    }
}

export async function createPermissionDB(db: Knex<any, unknown[]>) {
    if (!(await db.schema.hasTable('permission'))) {
        return await db.schema.createTable('permission', table => {
            table.increments('id').primary();
            table.integer('user');
            table.integer('permission');
        });
    }
}

export async function dropPermissionDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('permission');
}

export async function dropPermissionLinkDB(db: Knex<any, unknown[]>) {
    return await db.schema.dropTable('permission_link');
}

export async function dropPermissionDBs(db: Knex<any, unknown[]>) {
    return {permission: await dropPermissionDB(db), permission_link: await dropPermissionLinkDB(db)}
}

export async function insertPermission(db: Knex<any, unknown[]>, permission: PermissionDBModel): Promise<ResponseData> {
    const { id, ...permissionWithoutId } = permission;

    const permissionExists = await db('permission').where({ permission: permissionWithoutId.permission, user: permissionWithoutId.user }).first();

    if(permissionExists) return {statusCode: 409, error: 'Permission already exists'}

    return {statusCode: 200, data: await db('permission').insert(permissionWithoutId)};
}

export async function insertPermissionLink(db: Knex<any, unknown[]>, permissionLink: PermissionLinkModel): Promise<ResponseData> {
    const { id, ...permissionLinkWithoutId } = permissionLink;

    if(!permissionLinkWithoutId.permission_id) return {statusCode: 400, error: 'Permission id is required'}
    if(!permissionLinkWithoutId.media_id) return {statusCode: 400, error: 'Media id is required'}

    const permissionExists = await db('permission').where({ id: permissionLinkWithoutId.permission_id }).first();

    if(!permissionExists) return {statusCode: 404, error: 'Permission not found'}

    const mediaExists = await db('media').where({ id: permissionLinkWithoutId.media_id }).first();

    if(!mediaExists) return {statusCode: 404, error: 'Media not found'}

    const permissionLinkExists = await db('permission_link').where({ permission_id: permissionLinkWithoutId.permission_id, media_id: permissionLinkWithoutId.media_id }).first();

    if(permissionLinkExists) return {statusCode: 409, error: 'Permission link already exists'}

    return{ statusCode: 200, data: await db('permission_link').insert(permissionLinkWithoutId)};
}

export async function insertPermissionFull(db: Knex<any, unknown[]>, permission: PermissionDBModel, media_id: number): Promise<ResponseData> {
    const { id, ...permissionWithoutId } = permission;

    let permissionExists = await db('permission').where({ permission: permissionWithoutId.permission, user: permissionWithoutId.user }).first();
    let permission_id = null;

    if(!permissionExists) {
        const permissionInsertResult = await insertPermission(db, permission);
        if(permissionInsertResult.statusCode !== 200) return permissionInsertResult;
        permission_id = permissionInsertResult.data[0];
    }

    if(permission_id === null) permission_id = permissionExists.id;

    const permissionLink1 = await insertPermissionLink(db, {permission_id: permission_id, media_id: media_id});

    return permissionLink1;
}


export async function getPermissionsByMediaId(db: Knex<any, unknown[]>, media_id: number): Promise<ResponseData> {
    const permissionLinks = await db('permission_link').where({ media_id: media_id });

    if(permissionLinks.length === 0) return {statusCode: 404, error: 'No permissions found'}

    const permissions: PermissionModel[] = [];

    for (const permissionLink of permissionLinks) {
        const permission = await getPermissionById(db, permissionLink.permission_id);
        if(permission.statusCode !== 200) return permission;
        const user = await getUserById(db, permission.data.user);
        if(user.statusCode !== 200) return user;
        permission.data.user = user.data;
        permissions.push(permission.data);
    }

    return {statusCode: 200, data: permissions};
}

export async function getPermissionById(db: Knex<any, unknown[]>, permission_id: number): Promise<ResponseData> {
    const permission = await db('permission').where({ id: permission_id }).first();

    const user = await getUserById(db, permission.user);

    const permissionModel: PermissionModel = {
        id: permission.id,
        permission: permission.permission,
        user: user.data
    }

    if(!permission) return {statusCode: 404, error: 'Permission not found'}

    return {statusCode: 200, data: permissionModel};
}
