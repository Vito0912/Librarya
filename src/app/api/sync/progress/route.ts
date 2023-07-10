import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import UserDB from "../../../../database/utils/user";
import db from "../../../../database/connect";

export async function PUT(req: NextRequest, res: NextResponse) {

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

    let syncData = await req.json();
    
    if(syncData === undefined) return NextResponse.json({ message: 'No data', success: true }, { status: 400 });

    const current_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if(await db('position').where({user_id: dbUser.userModel.id, media_md5: syncData.document, device_id: syncData.device_id}).first() === undefined) {
        const [createdId] = await db('position').insert({user_id: dbUser.userModel.id, media_md5: syncData.document, progress: syncData.progress, percentage: syncData.percentage, device_id: syncData.device_id, device: syncData.device, time: current_time })
    } else {
        const updatedCount = await db('position').where({user_id: dbUser.userModel.id, media_md5: syncData.document, device_id: syncData.device_id}).update({progress: syncData.progress, percentage: syncData.percentage, device: syncData.device, time: current_time })
    }

    // Check if inseted or updated


    // TODO: Seek for for md5 hash of media in database and connect them to view in media browser
   
    return NextResponse.json({ message: 'OK', success: true }, { status: 200});
}

