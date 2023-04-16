import { Schema, Model, model } from 'mongoose';
import { Status } from './status.model';
import {
    IAdmin, IAdminDoc,
    ICareGiver, ICareGiverDoc,
    IPatient, IPatientDoc,
    ISuperAdmin, ISuperAdminDoc,
    IUser, IUserDoc, IUserMethods, IUserModel
} from './types/user.types';
import { createProfile, getProfile } from './profile';
import { AuthCode } from './auth.model';
import { NODE_ENV } from '../config';
import { IDoctorDoc, IDoctor } from './types/caregiver.types';

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
            enum: ['Admin', 'SuperAdmin', 'Patient', 'CareGiver'],
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

const patient_schema = new Schema<IPatientDoc>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        address: { type: String, required: true },
        contact_details: { type: [String], required: true },
        email: { type: String, required: true },
        role: { type: String, required: true, enum: ['Patient'], default: 'Patient' },
    },
    options
);

const care_giver_schema = new Schema<ICareGiverDoc>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        contact_details: { type: [String], required: true },
        email: { type: String, required: true },
        role: { type: String, required: true, enum: ['CareGiver'], default: 'CareGiver' },
        ratings: { type: Number, required: true, default: 0 },
        website: { type: String, required: false },
    },
    options
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

const doctor_schema = new Schema<IDoctorDoc>({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone_number: { type: String, required: true },
    number_of_patients: { type: Number, required: true, default: 0 },
    experience: { type: Number, required: true },
    medical_unit: { type: String, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female'] },
    biography: { type: String, required: true },
    procedures: [{ type: Schema.Types.ObjectId, ref: 'Procedure' }],
    care_giver: { type: Schema.Types.ObjectId, ref: 'CareGiver' },
    hidden: { type: Boolean, required: true, default: false, select: false },
})

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
    Patient: Model<IPatientDoc> = model<IPatientDoc>('Patient', patient_schema),
    CareGiver: Model<ICareGiverDoc> = model<ICareGiverDoc>('CareGiver', care_giver_schema),
    Admin: Model<IAdminDoc> = model<IAdminDoc>('Admin', admin_schema),
    SuperAdmin: Model<ISuperAdminDoc> = model<ISuperAdminDoc>('SuperAdmin', super_admin_schema),
    Doctor: Model<IDoctorDoc> = model<IDoctorDoc>('Doctor', doctor_schema);

export {
    User, IUser, IUserDoc,
    Patient, IPatient, IPatientDoc,
    CareGiver, ICareGiver, ICareGiverDoc,
    Admin, IAdmin, IAdminDoc,
    SuperAdmin, ISuperAdmin, ISuperAdminDoc,
    Doctor, IDoctor, IDoctorDoc
};
