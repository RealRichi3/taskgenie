/* eslint-disable no-debugger */
import { Types, Document, Model, ClientSession } from 'mongoose';
import { IPasswordDoc } from './password.types';
import { IStatusDoc } from './status.types';
import { Email, WithPopulated } from '../../types';

/* User Types */
interface IUserRole {
    Admin: 'Admin';
    SuperAdmin: 'SuperAdmin';
}
type TUserRole = IUserRole[keyof IUserRole];
interface IUser {
    firstname: string;
    lastname: string;
    email: Email;
    role: IUserRole[keyof IUserRole];
    googleId?: string;
    githubId?: string;
    createdAt: Date;
    updatedAt: Date;
}
interface IUserDoc extends IUser, IUserMethods, Document { }
interface IUserModel extends Model<IUserDoc>, IUserMethods { }
interface IUserMethods {
    createProfile:
    <U extends IUsersDocs[keyof IUsersDocs]>(
        this: IUserDoc,
        profile_data: TProfileData<U['role']>,
        session: ClientSession
    ) => Promise<TProfile<U['role']>>;
    getProfile: <U extends TUserRole>() => Promise<TProfile<U>>;
}
interface IUserWithVirtualsDoc<R extends TUserRole = TUserRole> extends IUserDoc {
    status: Types.ObjectId | IStatusDoc;
    password: Types.ObjectId | IPasswordDoc;
    user_profile: TProfile<R>
}
type UsersWithStrictRole<R extends TUserRole> = Omit<IUserDoc, 'role'> & { role: R }


/* User Profiles */
interface ISuperAdmin extends IUser {
    role: IUserRole['SuperAdmin'];
    user: Types.ObjectId | IUser;
}
interface ISuperAdminDoc extends ISuperAdmin, Document { }

interface IAdmin extends IUser {
    role: IUserRole['Admin'];
    user: Types.ObjectId | IUser;
}
interface IAdminDoc extends IAdmin, Document { }

/* User Profiles Grouped by Role */
type Users = {
    Admin: {
        plain: IAdmin;
        doc: IAdminDoc;
    };
    SuperAdmin: {
        plain: ISuperAdmin;
        doc: ISuperAdminDoc;
    }
}
type IUsers = {
    [key in keyof Users]: Users[key]['plain'];
}
type IUsersDocs = {
    [key in keyof Users]: Users[key]['doc'];
}

type TProfile<T extends IUser['role']> = IUsersDocs[T];
type TProfileData<T extends IUser['role']> = Omit<IUsers[T], 'user'>;
type TUserWithProfile = WithPopulated<IUserDoc, 'profile', TProfile<IUser['role']>>;
type TUserWithProfileAndStatus =
    WithPopulated<
        TUserWithProfile,
        'status',
        IStatusDoc
    >;

export {
    IUserWithVirtualsDoc,
    IUser,
    IUserModel,
    ISuperAdmin,
    IAdmin,
    IUserDoc,
    ISuperAdminDoc,
    IAdminDoc,
    IUserMethods,
    TProfile,
    TProfileData,
    TUserRole,
    TUserWithProfile,
    TUserWithProfileAndStatus,
    IUsers,
    IUsersDocs,
    Users,
    UsersWithStrictRole,
    IUserRole
};
