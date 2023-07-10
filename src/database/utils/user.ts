import db from "../connect";
import UserModel from "../models/userModel";
import bcrypt from 'bcrypt';

class User {

    public userModel: UserModel | undefined = undefined;

    public async login(userName: string, password: string, md5: boolean = false) {
        const user = await this.getUser(userName, -1);
        if (user !== undefined && password !== undefined ) {
            let match: boolean = false;
            if(md5) {
                match = (password == user.password_sync); 
            } else {
                match = await bcrypt.compare(password, user.password);
            }
            if (!match) {
                return false;
            }
            return true;
        }
        return false;
    }

    public async register(userName: string, password: string, mail: string, firstname: string, lastname: string) {
        
        const saltRounds = 10;
        const myPlaintextPassword = password;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(myPlaintextPassword, salt);

    }

    private async getUser(userName: string, userId: number): Promise<UserModel | undefined> {
        let userDB = await db('user').select('*').where('username', userName).first();
        if (userDB === undefined) {
            return undefined;
        }

        this.userModel = {
            id: userDB.id,
            username: userDB.username,
            firstname: userDB.firstname,
            lastname: userDB.lastname,
            mail: userDB.mail,
            password: userDB.password,
            password_sync: userDB.password_sync,
            role: userDB.role
        };

        return this.userModel;
    }
}

export default User;