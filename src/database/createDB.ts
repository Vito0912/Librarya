import bcrypt from 'bcrypt';
import crypto from 'crypto';

export default async function createDB(db: any) {
    if (!(await db.schema.hasTable('media'))) {
        await db.schema.createTable('media', (table: any) => {
            table.increments('id')
            table.string('title')
            table.string('sort')
            table.string('path')
            table.string('type')
            table.timestamp('created');
            table.timestamp('edited');
            table.timestamp('published');
            table.integer('author');
            table.string('isbn')
            table.string('uuid')
            table.string('author_sort')
            table.integer('series_index')
            table.boolean('has_cover')
        });
    }

    if (!(await db.schema.hasTable('user'))) {
        await db.schema.createTable('user', (table: any) => {
            table.increments('id')
            table.string('username')
            table.string('fistname')
            table.string('lastname')
            table.string('mail')
            table.string('password')
            table.string('password_sync')
            table.int('role')
        });
    }

    if (!(await db.schema.hasTable('author'))) {
        await db.schema.createTable('author', (table: any) => {
            table.increments('id')
            table.string('name')
            table.string('sort')
        });
    }

    // Add test book entry
    if(await db.from('media').where({title: 'Test Book'}).first() === undefined) {
        await db('author').insert({name: 'Test Author', sort: 'Test Author'});
        await db('media').insert({title: 'Test Book', sort: 'Test Book', path: 'test_book.epub', created: '2021-10-10 10:10:10', edited: '2021-10-10 10:10:10', published: '2021-10-10 10:10:10', author: 1, isbn: '1234567890', uuid: '1234567890', author_sort: 'Test Book', series_index: 1, has_cover: true});    
    } ;

    // Add test user
    if(await db.from('user').where({id: 0}).first() === undefined) {
        const saltRounds = 10;
        const myPlaintextPassword = 'admin';
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(myPlaintextPassword, salt);

        const md5Hash = crypto.createHash('md5').update(myPlaintextPassword).digest('hex');

        await db('user').insert({id: 0, username: 'admin', fistname: 'admin', lastname: 'admin', mail: 'test@test,de', password: hash, password_sync: md5Hash, role: 0});

    } ;

    if (!(await db.schema.hasTable('data'))) {
        await db.schema.createTable('data', (table: any) => {
            table.increments('id')
            table.integer('media')
            table.string('format')
            table.integer('size')
            table.integer('size_compressed')
            table.string('name')
        });
    }

    if (!(await db.schema.hasTable('connect'))) {
        await db.schema.createTable('connect', (table: any) => {
            table.increments('id')
            table.integer('media')
            table.string('type')
            table.string('connection')
        });
    }

    if (!(await db.schema.hasTable('language_index'))) {
        await db.schema.createTable('language_index', (table: any) => {
            table.increments('id')
            table.string('lange_code')
            table.string('lang_name')
        });
    }

    if (!(await db.schema.hasTable('series_link'))) {
        await db.schema.createTable('series_link', (table: any) => {
            table.increments('id')
            table.integer('media')
            table.integer('series')
        });
    }

    if (!(await db.schema.hasTable('tags_link'))) {
        await db.schema.createTable('tags_link', (table: any) => {
            table.increments('id')
            table.integer('media')
            table.integer('tag')
        });
    }

    if (!(await db.schema.hasTable('ratings_link'))) {
        await db.schema.createTable('ratings_link', (table: any) => {
            table.increments('id')
            table.integer('media')
            table.integer('rating')
        });
    }

    if (!(await db.schema.hasTable('publishers_link'))) {
        await db.schema.createTable('publishers_link', (table: any) => {
            table.increments('id')
            table.integer('media')
            table.integer('publisher')
        });
    }

    if (!(await db.schema.hasTable('languages_link'))) {
        await db.schema.createTable('languages_link', (table: any) => {
            table.increments('id')
            table.integer('media')
            table.integer('language')
        });
    }

    if (!(await db.schema.hasTable('series'))) {
        await db.schema.createTable('series', (table: any) => {
            table.increments('id')
            table.string('name')
            table.string('sort')
        });
    }

    if (!(await db.schema.hasTable('tags'))) {
        await db.schema.createTable('tags', (table: any) => {
            table.increments('id')
            table.string('name')
        });
    }

    if (!(await db.schema.hasTable('ratings'))) {
        await db.schema.createTable('ratings', (table: any) => {
            table.increments('id')
            table.integer('rating')
        });
    }

    if (!(await db.schema.hasTable('publisher'))) {
        await db.schema.createTable('publisher', (table: any) => {
            table.increments('id')
            table.integer('name')
            table.integer('sort')
        });
    }

    if (!(await db.schema.hasTable('position'))) {
        await db.schema.createTable('position', (table: any) => {
            table.increments('id')
            table.integer('user_id') // koreader compatible
            table.string('media_md5') // document
            table.integer('media_id') // document
            table.integer('media_id_overrite') // document
            table.string('progress') // progress
            table.integer('percentage')
            table.timestamp('time') // timestamp
            table.string('device') // device
            table.string('device_id') // device id
        });
    }

    if (!(await db.schema.hasTable('libraries'))) {
        await db.schema.createTable('libraries', (table: any) => {
            table.increments('id')
            table.string('name')
            table.string('path')
            table.string('description')
            table.timestamp('created')
            table.timestamp('last_modified')
        });
    }

    if (!(await db.schema.hasTable('library_books'))) {
        await db.schema.createTable('library_books', (table: any) => {
            table.increments('id')
            table.integer('library')
            table.integer('media')
            table.integer('sort')
        });
    }
}