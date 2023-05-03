import { Schema, model, Model } from 'mongoose'
import { IService, IServiceDoc, IInstance, IInstanceDoc } from '../types'

const options = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
}

const service_schema = new Schema<IServiceDoc>({
    name: { type: String, required: true, unique: true },
    version: { type: Number, required: true },
    path: { type: String, required: true },
}, options)

const instance_schema = new Schema<IInstanceDoc>({
    service_id: { type: Schema.Types.ObjectId, required: true },
    protocol: { type: String, required: true },
    host: { type: String, required: true },
    url: { type: String, required: true },
    port: { type: Number, required: true },
    last_heartbeat: { type: Date, required: true },
}, options)

const Service: Model<IServiceDoc> = model<IServiceDoc>('Service', service_schema)
const Instance: Model<IInstanceDoc> = model<IInstanceDoc>('Instance', instance_schema)

export {
    Service, IService, IServiceDoc,
    Instance, IInstance, IInstanceDoc
}