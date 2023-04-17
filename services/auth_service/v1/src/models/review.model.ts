import { Model, model, Schema } from 'mongoose';
import { IReviewDoc } from './types/review.types';


const options = { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } };

const review_schema = new Schema<IReviewDoc>({
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
    appointment: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
    }],
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, options);

const Review: Model<IReviewDoc> = model<IReviewDoc>('Review', review_schema);

export { Review };