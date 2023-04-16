/* eslint-disable no-debugger */
import { Types, Document, Model, ClientSession } from 'mongoose';
import { IPasswordDoc } from './password.types';
import { IStatusDoc } from './status.types';
import { Email, WithPopulated } from '../../types';

interface IUserRole {
    Admin: 'Admin';
    SuperAdmin: 'SuperAdmin';
}
type TUserRole = IUserRole[keyof IUserRole];
interface IUser {
    firstname: string;
    lastname: string;
    email: Email;
    role: TUserRole;
    googleId?: string;
    githubId?: string;
    createdAt: Date;
    updatedAt: Date;
}

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
    [key in IUser['role']]: Users[key]['plain'];
}
type IUsersDocs = {
    [key in IUser['role']]: Users[key]['doc'];
}

interface IUserMethods {
    createProfile:
    <U extends IUsersDocs[keyof IUsersDocs]>(
        this: IUserDoc,
        profile_data: TProfileData<U['role']>,
        session: ClientSession
    ) => Promise<TProfile<U['role']>>;
    getProfile: <U extends TUserRole>() => Promise<TProfile<U>>;
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

interface IUserDoc extends IUser, IUserMethods, Document { }
interface IUserModel extends Model<IUserDoc>, IUserMethods { }

interface IUserWithVirtualsDoc<R extends TUserRole = TUserRole> extends IUserDoc {
    status: Types.ObjectId | IStatusDoc;
    password: Types.ObjectId | IPasswordDoc;
    user_profile: TProfile<R>
}

interface ISuperAdmin extends IUser {
    role: 'SuperAdmin';
    user: Types.ObjectId | IUser;
}
interface ISuperAdminDoc extends ISuperAdmin, Document { }

interface IAdmin extends IUser {
    role: 'Admin';
    user: Types.ObjectId | IUser;
}
interface IAdminDoc extends IAdmin, Document { }

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
};
