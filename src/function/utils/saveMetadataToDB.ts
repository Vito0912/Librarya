import db from "@/database/connect";
import Metadata from "../metadata/metadata";
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';
import dateFns from "date-fns";

class SaveMetadataToDB {

    private metadata: Metadata;
    private path: string;
    private file: ArrayBuffer;

    constructor( metadata: Metadata, path: string, file: ArrayBuffer ) {
        this.metadata = metadata;
        this.path = path;
        this.file = file;
    }

    public async saveMetadataToDB(): Promise<boolean> {
        
        try {

            await this.saveMediaToDB();

        } catch (error) {
            console.log('Error:', error);
            return false;
        }

        return true;
    }

    private async saveMediaToDB() {

        // Check if media already exists
        let author = await db.select('id').from('author').where({'name': this.metadata.metadataInfo!.author}).first();
        const media = await db.from('media').where({'title': this.metadata.metadataInfo!.title, 'author': author !== undefined ? (author.id ?? -1) : -1}).first();
        if (media === undefined) {

            if(author === undefined) {
                author = await db('author').insert({'name': this.metadata.metadataInfo!.author, 'sort': this.metadata.metadataInfo!.author_sort});
            }

            const fileExtensionWithDot = path.extname(this.path);
            const fileExtension = fileExtensionWithDot.substring(1, fileExtensionWithDot.length);

            // Media already exists
            await db('media').insert({
                title: (this.metadata.metadataInfo!.title) ?? '', 
                sort: this.metadata.metadataInfo!.sort ?? '', 
                path: (this.metadata.metadataInfo!.path ?? this.path) ?? '', 
                type: this.metadata.metadataInfo!.type ?? '', 
                created: this.metadata.metadataInfo!.creationDate, 
                edited: this.metadata.metadataInfo!.modificationDate, 
                published: this.metadata.metadataInfo!.published ?? '',
                author: author !== undefined ? (author.id ?? -1) : -1, 
                isbn: this.metadata.metadataInfo!.isbn ?? '', 
                uuid: uuidv4(), 
                author_sort: this.metadata.metadataInfo!.author_sort ?? '', 
                series_index: this.metadata.metadataInfo!.series_index ?? -1, 
                has_cover: this.metadata.metadataInfo!.has_cover ?? false
            });
        }
            



        //
    }

}

export default SaveMetadataToDB;