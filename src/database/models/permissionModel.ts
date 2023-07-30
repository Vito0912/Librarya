import UserModel from "./userModel";

export interface PermissionModel {
    id?: number;
    user: UserModel | number; 
    permission: number;
}