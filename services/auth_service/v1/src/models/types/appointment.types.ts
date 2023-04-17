import { Document, Types } from 'mongoose';
import { ICareGiverDoc } from './caregiver.types';
import { IPatientDoc } from './user.types';
import { IProcedureDoc } from './caregiver.types';

interface IAppointment {
    care_giver: Types.ObjectId | ICareGiverDoc;
    patient: Types.ObjectId | IPatientDoc;
    procedure: Types.ObjectId | IProcedureDoc;
    date: Date;
    time: string;
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

interface IAppointmentDoc extends IAppointment, Document { }

export { IAppointment, IAppointmentDoc }; 