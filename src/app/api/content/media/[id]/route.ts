import { NextRequest, NextResponse } from "next/server"
import db from '@/database/connect';
import fs from 'fs';

export async function GET(request: Request,
    { params }: { params: { id: number } }) {

        const id = params.id;

        // TODO: add screen when not using "Accept: application/json"
        if(!id) {
            return NextResponse.json({ message: 'No id provided', success: false }, { status: 400 })
        }

        // TODO: Add auth check

        const data = await db('media').where({id: id}).select('path').first();

        if(data === undefined) return NextResponse.json({ message: 'Media not found', success: false }, { status: 404 })

        const path = data.path;
        const diskPath = './uploads/' + path;
        if(!fs.existsSync(diskPath)) return NextResponse.json({ message: 'Media not found', success: false }, { status: 404 }) 


        const fileBuffer = fs.readFileSync(diskPath);

        const response = new NextResponse(fileBuffer, {status: 200});

        //TODO: Implement induvidual file types
        response.headers.set('Content-Type', 'application/pdf');
        response.headers.set('Content-Disposition', 'attachment; filename=' + path);

        return response;
        
}