import { Document, Types } from 'mongoose';
import { ICareGiverDoc } from './caregiver.types';
import { IPatientDoc } from './user.types';
import { IAppointmentDoc } from './appointment.types';

interface IReview {
    care_giver: Types.ObjectId | ICareGiverDoc;
    patient: Types.ObjectId | IPatientDoc;
    appointment: Types.ObjectId[] | IAppointmentDoc[];
    rating: number;
    comment: string;
}

interface IReviewDoc extends IReview, Document { }

export { IReview, IReviewDoc };