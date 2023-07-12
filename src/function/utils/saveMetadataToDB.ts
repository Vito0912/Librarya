import db from "@/database/connect";
import Metadata from "../metadata/metadata";
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import crypto from 'crypto';
import FileHelper from "./helpers/file";

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
                author = await db('author').insert({'name': this.metadata.metadataInfo!.author, 'sort': this.metadata.metadataInfo!.author_sort ?? this.metadata.metadataInfo!.author});
            }

            const fileExtensionWithDot = path.extname(this.path);
            const fileExtension = fileExtensionWithDot.substring(1, fileExtensionWithDot.length);
            const md5Binary = this.generateMD5HashBinary();
            const md5Filename = this.genereateMD5HashFilename()
            const fileSizes = await FileHelper.getSize(this.path);

            // Media already exists
            const media = await db('media').insert({
                title: (this.metadata.metadataInfo!.title) ?? 'Unkown', 
                sort: this.metadata.metadataInfo!.sort ?? '', 
                path: (this.metadata.metadataInfo!.path ?? this.path) ?? '', 
                media_type: 0, //TODO: Add media type conversion 
                created: this.metadata.metadataInfo!.creationDate, 
                edited: this.metadata.metadataInfo!.modificationDate, 
                published: this.metadata.metadataInfo!.published ?? '',
                author: author !== undefined ? (author.id ?? -1) : -1, 
                isbn: this.metadata.metadataInfo!.isbn ?? '', 
                uuid: uuidv4(),
                md5_binary_checksum: md5Binary,
                md5_filename_checksum: md5Filename,
                author_sort: this.metadata.metadataInfo!.author_sort ?? '', 
                series_index: this.metadata.metadataInfo!.series_index ?? -1, 
                has_cover: this.metadata.metadataInfo!.has_cover ?? false
            }).returning('id');

            await db('media_info').insert({
                media_id: media[0].id,
                format: fileExtension,
                size: fileSizes.fileSize,
                size_compressed: fileSizes.compressedSize,
            });
        }
            



        //
    }

    private generateMD5HashBinary(): string {
        const m = crypto.createHash('md5');
        const step = 1024;
        const size = 1024;
    
        const file = fs.openSync(this.path, 'r');
    
        try {
        const sample = Buffer.alloc(size);
        let bytesRead = fs.readSync(file, sample, 0, size, 0);
        if (bytesRead > 0) {
            m.update(sample.slice(0, bytesRead));
        }
        for (let i = 0; i < 11; i++) {
            const offset = Math.pow(4, i) * step;
            bytesRead = fs.readSync(file, sample, 0, size, offset);
            if (bytesRead > 0) {
            m.update(sample.slice(0, bytesRead));
            } else {
            break;
            }
        }
        } finally {
        fs.closeSync(file);
        }
    
        const result = m.digest('hex');
    
        return result;
    }

    private genereateMD5HashFilename(): string {
        const fileName = path.basename(this.path);
        const hash = crypto.createHash('md5').update(fileName).digest('hex');
        return hash;
    }

}

export default SaveMetadataToDB;