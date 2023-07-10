interface UserModel {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    mail: string;
    password: string;
    password_sync: string;
    role: number;
  }

export default UserModel;