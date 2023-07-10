import knex from 'knex';
import path from "path";
import createDB from './createDB';
import fs from 'fs';

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

createDB(db);

export default db;
