import { Schema, Model, model } from 'mongoose';
import { IProcedureDoc, IProcedure } from './types/caregiver.types';

const options = { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } };

const procedure_schema = new Schema<IProcedureDoc>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        care_giver: {
            type: Schema.Types.ObjectId,
            ref: 'CareGiver',
            required: true,
        },
        hidden: { type: Boolean, required: true, default: false, select: false },
    },
    options
);

const Procedure: Model<IProcedureDoc> = model<IProcedureDoc>('Procedure', procedure_schema);

export { Procedure, IProcedureDoc, IProcedure };

