import PDFMetadata from "../../function/metadata/pdf";
import EPubMetadata from "../../function/metadata/epub";
import Metadata from "../metadata/metadata";
import convertToEnglish from "./helpers/convertToEnglish";
import SaveMetadataToDB from "./saveMetadataToDB";

export default async function converMetadata(file: ArrayBuffer, fileName: string, fileExtensionDot: string) {

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
            break;
    }

    if(metadata === undefined || metadata.metadataInfo === undefined) throw new Error("Metadata is undefined");

    const a = metadata.metadataInfo.author;

    // Convert to PascalCase
    let author_path: string = a.replace(/(\w)(\w*)/g, function(g0: string, g1: string, g2: string): string {
        return g1.toUpperCase() + g2.toLowerCase();
    });

    // Remove double spaces and trim spaces
    author_path = author_path.replace(/\s\s+/g, ' ').trim();
    author_path = convertToEnglish(author_path);

    const filePath = './uploads/' + author_path + '/' + convertToEnglish(fileName);

    const saveMetadata = new SaveMetadataToDB(metadata, filePath, file);

    const check = await saveMetadata.saveMetadataToDB();

    if(check === false) throw new Error("Error saving metadata to DB");

    return filePath;
}