import db from "@/database/connect";
import { NextRequest, NextResponse } from "next/server"
import UserDB from "@/database/utils/user";
import { headers } from "next/headers";

export async function GET(request: Request,
    { params }: { params: { document: string } }) {

        const username = headers()?.get('x-auth-user');
        const userkey = headers()?.get('x-auth-key');
    
        if (username == null || userkey == null) {
            return NextResponse.json({ message: 'Unauthorized', success: true }, { status: 401 });
          }

        let dbUser: UserDB = new UserDB;

        let auth = await dbUser.login(username, userkey, true);
    
        if(!auth || dbUser.userModel === undefined) {
            return NextResponse.json({ message: 'Unauthorized', success: true }, { status: 401 });
        }
        
        const documentName = params.document;

        if(!documentName) {
            return NextResponse.json({ message: 'Document not found', success: false }, { status: 404 })
        }

        const fetchJson = await db('position').where({'media_md5': documentName, 'user_id': dbUser.userModel.id }).first();

        if(fetchJson === undefined) {
            return NextResponse.json({ message: 'Document not found', success: false }, { status: 404 })
        }

        const { progress, percentage, device, device_id, time } = fetchJson;
        const formatedJson = { progress, percentage, device, device_id, timestamp: time };

        return NextResponse.json(formatedJson, { status: 200 })
        
}