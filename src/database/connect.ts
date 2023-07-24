import knex from 'knex';
import path from "path";
import createDB from './createDB';
import fs from 'fs';
import { createMediaDB, insertMediaDB, insertMediaToDB } from './models/db/mediaDBModel';
import { createAuthorDBs, getAuthorsByMediaId } from './models/db/authorDBModel';

const dbPath = path.resolve('./src/database/data.sql');
const dirPath = path.dirname(dbPath);

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const db = knex({
    client: 'better-sqlite3',
    connection: {
        filename: path.resolve('./src/database/data.sql'),
    },
    useNullAsDefault: true,
});

createMediaDB(db).then(() => {
    console.log('Database created 1');
    createAuthorDBs(db).then(() => {

        insertMediaToDB(db, {
            title: 'Test',
            uuid: 'test',
            md5_filname: 'test',
            sort: 'test',
            md5_binary: 'test',
            path: 'test',
            creationDate: 0,
            modificationDate: 0,
            publishedDate: 0,
            hasCover: false,
            authors: [
                {
                    name: 'Michael Jackson',
                    sort: 'Jackson, Michael'
                }
            ],
        }).then((val) => {
            getAuthorsByMediaId(db, val.data).then((val1) => {
                console.log(val1)
            });
            console.log(val)
        
        });

    });
});

//createDB(db);

export default db;
