import { Types, Document } from 'mongoose';
import { IAppointmentDoc } from './appointment.types';
import { IReviewDoc } from './review.types';
import { IUser } from './user.types';
import { Email, WithPopulated } from '../../types';

interface ICareGiver extends IUser {
    user: Types.ObjectId | IUser;
    name: string;
    address: string;
    contact_details: string[] | string;
    email: Email;
    role: 'CareGiver';
    ratings: 0 | 1 | 2 | 3 | 4 | 5;
    website: string | null;
    // reviews: Types.ObjectId | IReviewDoc;
}

interface IDoctor {
    firstname: string;
    lastname: string;
    phone_number: string;
    number_of_patients: number;
    experience: number;
    medical_unit: string;
    biography: string;
    gender: 'Male' | 'Female';
    procedures: Types.ObjectId[] | IProcedureDoc[] | [] | null;
    care_giver: Types.ObjectId | ICareGiverDoc;
    hidden: boolean;
}

type IDoctorWithProcedures = WithPopulated<IDoctorDoc, 'procedures', IProcedureDoc>;
type IDoctorWithClinic = WithPopulated<IDoctorDoc, 'care_giver', ICareGiverDoc>;
type IDoctorWithProceduresAndClinic = WithPopulated<IDoctorWithProcedures, 'care_giver', ICareGiverDoc>;

interface IDoctorDoc extends IDoctor, Document { }

interface ICareGiverDoc extends ICareGiver, Document {
    appointments: Types.ObjectId[] | IAppointmentDoc[] | null;
    reviews: Types.ObjectId[] | IReviewDoc[] | null;
    procedures: Types.ObjectId[] | IProcedureDoc[] | [] | null;
}

interface IProcedure {
    name: string;
    description: string;
    care_giver: Types.ObjectId | ICareGiverDoc;
    price: number;
    hidden: boolean;
}

interface IProcedureDoc extends IProcedure, Document { }
type IProcedureWithCareGiver = WithPopulated<IProcedureDoc, 'care_giver', ICareGiverDoc>;

export { 
    ICareGiver, ICareGiverDoc,
    IDoctor, IDoctorDoc,
    IDoctorWithProcedures, IDoctorWithClinic,
    IDoctorWithProceduresAndClinic,
    IProcedure, IProcedureDoc, 
    IProcedureWithCareGiver };