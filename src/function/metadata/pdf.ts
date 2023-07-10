
import fs from 'fs';
import Metadata  from '../../function/metadata/metadata';
import { PDFDocument } from 'pdf-lib';
import * as p from 'path';
//import pdf from 'pdf-parse';

class PDFMetadata extends Metadata {


    public async fetchMetadata(path?: string, file?: Buffer, filename?: string) {
        if((path === undefined && file === undefined) || (path !== undefined && file !== undefined)) throw new Error("Need to provide either a path or a file buffer");

        if(file === undefined) file = fs.readFileSync(path!);

        const pdfDoc = await PDFDocument.load(file);


        this.metadata = pdfDoc;
        this.metadataInfo = {
            title: pdfDoc.getTitle() ?? filename ?? 'Unkown',
            author: pdfDoc.getAuthor() || pdfDoc.getCreator() || pdfDoc.getProducer() || 'Unkown',
            subject: pdfDoc.getSubject(),
            keywords: pdfDoc.getKeywords(),
            creationDate: pdfDoc.getCreationDate(),
            modificationDate: pdfDoc.getModificationDate(),
            pageCount: pdfDoc.getPageCount(),
            sort: pdfDoc.getTitle() ?? 'Unkown',
            author_sort: pdfDoc.getAuthor() || pdfDoc.getCreator() || pdfDoc.getProducer() || 'Unkown',
            path: path,
            type: 'pdf',
            published: undefined,
            isbn: undefined,
            series_index: undefined,
            has_cover: true

        }
    }


}

export default PDFMetadata;