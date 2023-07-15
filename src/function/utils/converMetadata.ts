import PDFMetadata from "../../function/metadata/pdf";
import EPubMetadata from "../../function/metadata/epub";
import Metadata from "../metadata/metadata";
import convertToEnglish from "./helpers/convertToEnglish";
import SaveMetadataToDB from "./saveMetadataToDB";
import { ResponseData } from "@/database/models/responseData";
import fs from 'fs';
import { writeFile } from "fs/promises";
import path from "path";

export default async function converMetadata(file: ArrayBuffer, fileName: string, fileExtensionDot: string): Promise<ResponseData> {

    const fileNameWithoutExtension = fileName.slice(0, fileName.length - fileExtensionDot.length);
    const fileExtension = fileExtensionDot.slice(1);

    let metadata: Metadata = new Metadata();

    switch (fileExtension) {
        case 'pdf':
            let tmp = new PDFMetadata();
            await tmp.fetchMetadata(undefined, Buffer.from(file), fileNameWithoutExtension);
            metadata = tmp;
            break;

        case 'epub':
            metadata = new EPubMetadata();
    
        default:
            return { statusCode: 415, error: "File extension not supported" };
    }

    if(metadata === undefined || metadata.metadataInfo === undefined) throw { statusCode: 500, error: "Error fetching metadata from file. Is it suported?"}

    const a = metadata.metadataInfo.author;

    // Convert to PascalCase
    let author_path: string = a.replace(/(\w)(\w*)/g, function(g0: string, g1: string, g2: string): string {
        return g1.toUpperCase() + g2.toLowerCase();
    });

    // Remove double spaces and trim spaces
    author_path = author_path.replace(/\s\s+/g, ' ').trim();
    author_path = convertToEnglish(author_path);

    const filePath = './uploads/' + author_path + '/' + convertToEnglish(fileName);


    const folderPath = path.dirname(filePath);
    if (!fs.existsSync(folderPath)) {
      await fs.promises.mkdir(folderPath, { recursive: true });
    }

    await writeFile(filePath, Buffer.from(file));


    const saveMetadata = new SaveMetadataToDB(metadata, filePath, file);

    const check = await saveMetadata.saveMetadataToDB();

    if(check === false) throw new Error("Error saving metadata to DB");

    return { statusCode: 200, data: filePath };
}