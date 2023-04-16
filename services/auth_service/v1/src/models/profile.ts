import {
    IAdminDoc,
    TProfile,
    ISuperAdminDoc,
    IUserDoc, TProfileData, IUsersDocs, Users, IUser, TUserRole
} from './types/user.types';
import { model, ClientSession } from 'mongoose'

async function createSuperAdminProfile(
    user: IUserDoc,
    session?: ClientSession
): Promise<ISuperAdminDoc> {
    const doc = session
        ? model<ISuperAdminDoc>('SuperAdmin')
            .create([{ user: user._id }], { session })
            .then(doc => doc[0])
        : model<ISuperAdminDoc>('SuperAdmin').create({ user: user._id });

    return doc;
}

async function createAdminProfile(
    user: IUserDoc,
    session?: ClientSession
): Promise<IAdminDoc> {
    const doc = session
        ? model<IAdminDoc>('Admin')
            .create([{ user: user._id }], { session })
            .then(doc => doc[0])
        : model<IAdminDoc>('Admin').create({ user: user._id });

    return doc;
}

async function createProfile<R extends TUserRole>(
    this: Omit<IUserDoc, 'role'> & { role: R },
    session?: ClientSession
): Promise<TProfile<R>> {
    switch (this.role as TUserRole) {
        case 'Admin':
            return createAdminProfile(this, session) as unknown as TProfile<R>
        case 'SuperAdmin':
            return createSuperAdminProfile(this, session) as unknown as TProfile<R>
    }
}

async function getProfile(this : IUserDoc): Promise<TProfile<typeof this.role>> {
    type Profile = TProfile<typeof this.role>;
    const res = await model<Profile>(this.role).findOne({ user: this._id })

    return res?.toObject() as unknown as Promise<Profile>;
}

export  {
    createProfile,
    getProfile
}