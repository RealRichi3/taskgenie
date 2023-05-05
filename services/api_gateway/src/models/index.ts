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
    service: { type: Schema.Types.ObjectId, required: true, ref: 'Service'},
    protocol: { type: String, required: true },
    host: { type: String, required: true },
    url: { type: String, required: true },
    port: { type: Number, required: true },
    last_heartbeat: { type: Date, required: true, default: Date.now() },
}, options)

instance_schema.pre('validate', function (next) {
    this.url = `${this.protocol}://${this.host}:${this.port}`
    next()
})

service_schema.pre('validate', function (next) {
    this.path = `/${this.name}/v${this.version}`
    next()
})

const Service: Model<IServiceDoc> = model<IServiceDoc>('Service', service_schema)
const Instance: Model<IInstanceDoc> = model<IInstanceDoc>('Instance', instance_schema)

export {
    Service, IService, IServiceDoc,
    Instance, IInstance, IInstanceDoc
}