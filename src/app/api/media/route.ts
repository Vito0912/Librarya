import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from "next/server";
import db from '../../../database/connect';
import * as path from 'path';
import converMetadata from '../../../function/utils/converMetadata';
import {ResponseData}  from '@/database/models/responseData';


export async function GET(req: NextRequest, res: NextResponse) {
  const books = await getMedia();
  return NextResponse.json(books);
}

export async function POST(request: NextRequest, response: NextResponse) {
  let uploaded: boolean = false;
  // Extracts the form data from the request (Needs NextRequest!)
  const formData = await request.formData();

  for (const [key, value] of formData.entries()) {
    if(key.includes('file')) {
      try {
        const file = value as File;
        const buffer = await file.arrayBuffer();
  
        // Get file name and extension
        const fileName = file.name;
        
        const fileExtensionWithDot = path.extname(fileName);
  
        const responseData: ResponseData = await converMetadata(buffer, fileName, fileExtensionWithDot);
        if(responseData.statusCode != 200) return NextResponse.json({ data: "", error: responseData.error }, { status: responseData.statusCode });
        uploaded = true;

      } catch (error) {
        
      }
    }
  }
  if(uploaded) return NextResponse.json({ data: "File uploaded successfully", error: null }, { status: 200 });
  return NextResponse.json({ data: null, error: "No files provided" }, { status: 400 });
}


async function getMedia() {
  const books = await db.select().from('media');
  return books;
}