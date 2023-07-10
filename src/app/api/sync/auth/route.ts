import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import UserDB from '../../../../database/utils/user';

class ServiceError extends Error {
  status_code: number;

  constructor(message: string, status_code: number) {
    super(message);
    this.status_code = status_code;
  }
}

interface User {
  username: string;
  userkey: string;
}

const users: { [key: string]: User } = {};

async function authorizeRequest(request: NextRequest, response: NextResponse): Promise<User> {
  let username: string | null = null;
  let userkey: string | null = null;

  const headersValue = await headers();
  if (headersValue != null) {
    username = headersValue.get('x-auth-user');
    userkey = headersValue.get('x-auth-key');
  }

  if (username == null || userkey == null) {
    throw new ServiceError('Unauthorized', 401);
  }

  let db: UserDB = new UserDB;

  let auth = await db.login(username, userkey, true);

  if(!auth || db.userModel === undefined) {
    throw new ServiceError('Unauthorized', 401);
  }

  const user: User =  { username, userkey };
  return user;
}



async function authorize(request: NextRequest, response: NextResponse) {
  const user = await authorizeRequest(request, response);
  if (user == null) {
    return NextResponse.json({ message: 'Unauthorized', success: true }, { status: 401 });
  }
  return true;
}


export async function GET(request: NextRequest, response: NextResponse ) {
  try {
   await authorize(request, response);
   return NextResponse.json({ message: 'OK', success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
  }
    
}