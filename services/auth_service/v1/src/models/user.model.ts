import { Schema, Model, model } from 'mongoose';
import { Status } from './status.model';
import {
    IAdmin, IAdminDoc, ISuperAdmin, ISuperAdminDoc,
    IUser, IUserDoc, IUserMethods, IUserModel
} from './types/user.types';
import { createProfile, getProfile } from './profile';
import { AuthCode } from './auth.model';
import { NODE_ENV } from '../config';

const options = { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } };

const user_schema = new Schema<IUserDoc, IUserModel, IUserMethods>(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['Admin', 'SuperAdmin'],
            default: 'Patient',
        },
        googleId: { type: String, select: false },
    },
    {
        timestamps: true,
        toObject: {
            transform: function (doc, ret) {
                delete ret.profile?.user
                // delete ret.profile.user
                return ret
            },
            virtuals: true
        },
        toJSON: { virtuals: true }
    }
);

const admin_schema = new Schema<IAdminDoc>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        role: { type: String, required: true, enum: ['Admin', 'SuperAdmin'], default: 'Admin' },
    },
    options
);

const super_admin_schema = new Schema<ISuperAdminDoc>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        role: { type: String, required: true, enum: ['SuperAdmin'], default: 'SuperAdmin' },
    },
    options
);

// Get users password from Password collection
user_schema.virtual('password', {
    ref: 'Password',
    localField: '_id',
    foreignField: 'user',
    justOne: true,
});

// Get authentication codes from AuthCode collection
user_schema.virtual('auth_codes', {
    ref: 'AuthCode',
    localField: '_id',
    foreignField: 'user',
    justOne: true,
});

// Get user users account status from Status collection
user_schema.virtual('status', {
    ref: 'Status',
    localField: '_id',
    foreignField: 'user',
    justOne: true,
});

user_schema.pre('validate', async function (next) {
    if (this.isNew) {
        const status = new Status({ user: this._id });

        NODE_ENV == 'dev'
            ? // Activate and verify user if in development mode
            ([status.isActive, status.isVerified] = [true, true])
            : // Only activate user if role is EndUser (user is still required to verify account)
            (status.isActive = this.role == 'Patient' ? true : false);

        await status.save();
        await AuthCode.create({ user: this._id });
    }

    next();
});

// user_schema.virtual('profile').get(async function (): Promise<TProfile<typeof this.role>> {
//     return this.getProfile();
// });

user_schema.method('createProfile', createProfile);
user_schema.method('getProfile', getProfile);

const
    User: Model<IUserDoc & IUserModel> = model<IUserDoc & IUserModel>('User', user_schema),
    Admin: Model<IAdminDoc> = model<IAdminDoc>('Admin', admin_schema),
    SuperAdmin: Model<ISuperAdminDoc> = model<ISuperAdminDoc>('SuperAdmin', super_admin_schema),

export {
    User, IUser, IUserDoc,
    Admin, IAdmin, IAdminDoc,
    SuperAdmin, ISuperAdmin, ISuperAdminDoc,
};
