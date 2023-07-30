import db from "@/database/connect";
import Metadata from "../metadata/metadata";
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import crypto from 'crypto';
import FileHelper from "./helpers/file";
import { MediaModel } from "@/database/models/mediaModel";
import { insertMediaToDB } from "@/database/models/db/mediaDBModel";
import { ResponseData } from "@/database/models/responseData";
import { FileType } from "@/database/models/enums/filetype";

class SaveMetadataToDB {

    private metadata: Metadata;
    private path: string;

    constructor( metadata: Metadata, path: string) {
        this.metadata = metadata;
        this.path = path;
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

    private async saveMediaToDB(): Promise<ResponseData> {

        const media_uuid = uuidv4();

        if(this.metadata.metadataInfo === undefined) return {statusCode: 500, error: "Error fetching metadata from file. Is it suported?"}

        const media: MediaModel = {
            title: this.metadata.metadataInfo.title,
            uuid: media_uuid,
            md5_filname: this.genereateMD5HashFilename(),
            md5_binary: this.generateMD5HashBinary(),
            path: this.path,
            users: [
                {
                    permission: 0,
                    user: this.metadata.metadataInfo.user_id
                }
            ],
            stats: {
                file_type: FileType[this.metadata.metadataInfo.file_type],
                file_size: (await FileHelper.getSize(this.path)).fileSize,
                download_count: 0
            },
            authors: [
                
            ]
        }

        const status = insertMediaToDB(db, media);
        return {statusCode: 200, data: status}
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