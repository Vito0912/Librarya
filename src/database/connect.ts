import knex, { Knex } from 'knex';
import path from "path";
import createDB from './createDB';
import fs from 'fs';
import { createMediaDB, insertMediaDB, insertMediaToDB } from './models/db/mediaDBModel';
import { createAuthorDBs, getAuthorsByMediaId } from './models/db/authorDBModel';
import { createUserDB } from './models/db/userDBModel';
import { createIdentifierDBs } from './models/db/identifierDBModel';
import { createLanguageDBs } from './models/db/languageDBModel';
import { createPermissionDBs } from './models/db/permissionDBModel';
import { createRatingDBs } from './models/db/ratingDBModel';
import { createSeriesDBs } from './models/db/seriesDBModel';
import { createTagDBs } from './models/db/tagDBModel';
import { createStatsDBs } from './models/db/statsDBModel';

const dbPath = path.resolve('./src/database/data.sql');
const dirPath = path.dirname(dbPath);

let db: Knex;

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dirPath, { recursive: true });


    db = knex({
        client: 'better-sqlite3',
        connection: {
            filename: path.resolve('./src/database/data.sql'),
        },
        useNullAsDefault: true,
    });

    createMediaDB(db).then(async () => {
        await createAuthorDBs(db);
        await createUserDB(db);
        await createIdentifierDBs(db);
        await createLanguageDBs(db);
        await createPermissionDBs(db);
        await createRatingDBs(db);
        await createSeriesDBs(db);
        await createTagDBs(db);
        await createStatsDBs(db);
    });

} else {
    db = knex({
        client: 'better-sqlite3',
        connection: {
            filename: path.resolve('./src/database/data.sql'),
        },
        useNullAsDefault: true,
    });
}

//createDB(db);

export default db;
