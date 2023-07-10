class Metadata {

    public metadataInfo: {
        title: string;
        author: string;
        subject: any;
        keywords: any;
        creationDate: any;
        modificationDate: any;
        pageCount: number;

        sort: string,
        author_sort: string, 

        path: string | undefined, 
        type: string, 
        published: any, 
        isbn: string | undefined, 
        series_index: number | undefined, 
        has_cover: boolean
    } | undefined;
    public metadata: any;

}

export default Metadata;