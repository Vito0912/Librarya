import UserModel from "./userModel";

export interface PermissionModel {
    id?: number;
    user: UserModel;
    permission: number;
}