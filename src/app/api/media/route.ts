import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from "next/server";
import db from '../../../database/connect';
import { writeFile } from 'fs/promises';
import * as path from 'path';
import converMetadata from '../../../function/utils/converMetadata';
import fs from 'fs';


export async function GET(req: NextRequest, res: NextResponse) {
  const books = await getMedia();
  return NextResponse.json(books);
}

export async function POST(request: NextRequest, response: NextResponse) {

  // Extracts the form data from the request (Needs NextRequest!)
  const formData = await request.formData();

  formData.forEach(async (value, key) => {
    if(key.includes('file')) {
      const file = value as File;
      const buffer = await file.arrayBuffer();

      // Get file name and extension
      const fileName = file.name;
      
      const fileExtensionWithDot = path.extname(fileName);

      const filePath = await converMetadata(buffer, fileName, fileExtensionWithDot);

      // Create folder if not exists
      const folderPath = path.dirname(filePath);
      if (!fs.existsSync(folderPath)) {
        await fs.promises.mkdir(folderPath, { recursive: true });
      }

      await writeFile(filePath, Buffer.from(buffer));
    }
  });

  return NextResponse.json({ data: "", error: null });
}


async function getMedia() {
  const books = await db.select().from('media');
  return books;
}