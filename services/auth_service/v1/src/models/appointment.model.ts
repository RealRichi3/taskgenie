import { Model, model, Schema } from 'mongoose';
import { IAppointmentDoc } from './types/appointment.types';

const options = { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } };

const appointment_schema = new Schema<IAppointmentDoc>(
    {
        care_giver: {
            type: Schema.Types.ObjectId,
            ref: 'CareGiver',
            required: true,
        },
        patient: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        procedure: {
            type: Schema.Types.ObjectId,
            ref: 'Procedure',
            required: true,
        },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'accepted', 'rejected', 'completed'],
            default: 'pending',
        },
    },
    options
);

const Appointment: Model<IAppointmentDoc> = model<IAppointmentDoc>('Appointment', appointment_schema);

export { Appointment };
