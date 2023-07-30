class Metadata {

    public metadataInfo: {
        id: number | undefined;
        title: string;
        author: number | undefined;
        subject: any;
        keywords: any;
        creationDate: any;
        modificationDate: any;
        pageCount: number;

        sort: string,
        author_sort: string,
        user_id: number,

        path: string | undefined, 
        type: string, 
        published: any, 
        isbn: string | undefined, 
        series_index: number | undefined, 
        has_cover: boolean
        file_type: string
    } | undefined;
    public metadata: any;

}

export default Metadata;