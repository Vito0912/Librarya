import * as fs from 'fs';
import * as zlib from 'zlib';

class FileHelper {
    
    public static async getSize(path: string): Promise<{ fileSize: number; compressedSize: number; }> {

        const stats = fs.statSync(path);
        const fileSize = stats.size;

        // TODO: Calulate the compression rate and size for specific file types
        const compressedSize = fileSize;

        return {fileSize, compressedSize};
    }

}

export default FileHelper;