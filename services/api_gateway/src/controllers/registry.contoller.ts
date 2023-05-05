import { Request, Response, NextFunction } from 'express';
import { addServiceToRegistry, deleteInstance } from '../utils/registry'
import { encodeData } from '../utils/jwt';
import { AuthenticatedRequest, IInstanceDoc, IServiceDoc, PopulateVirtualDoc } from '../types';
import { BadRequestError, InternalServerError, NotFoundError } from '../utils/errors';
import { Instance, Service } from '../models';

const registerService = async (req: Request, res: Response, next: NextFunction) => {
    const {
        protocol, host, port, name, version
    } = req.body

    const doc =
        await addServiceToRegistry(
            { protocol, host, port, name, version },
            req
        )

    if (!doc) {
        return next(new InternalServerError('Service could not be registered'))
    }

    const api_key = await encodeData(doc.toObject())

    // TODO: Save API key for this service

    res.status(200).send({
        success: true,
        message: "Service registered successfully",
        data: {
            service: doc.service,
            instance: doc,
            api_key
        }
    })
}

const unregisterService = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const service_id = req.instance.service._id

    const service = await Service.findById(service_id)

    if (!service) {
        return next(new BadRequestError('Service is not registered'))
    }

    await service.deleteOne()
    await Instance.deleteMany({ service: service_id })

    // TODO: Delete the API key for this service

    res.status(200).send({
        success: true,
        message: "Service unregistered successfully",
        data: null
    })
}

const getServices = async (req: Request, res: Response, next: NextFunction) => {
    type ServiceWithInstances = PopulateVirtualDoc<IServiceDoc, 'instances', IInstanceDoc[]>
    const services = await Service.find().populate<ServiceWithInstances>('instances')

    res.status(200).send({
        success: true,
        message: "Services queried successfully",
        data: {
            services: services.filter(service => service.toObject())
        }
    })
}

const getService = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const instance = await Instance.findById(req.instance._id).populate('service')

    if (!instance) {
        return next(new NotFoundError('Service not found'))
    }

    res.status(200).send({
        success: true,
        message: "Instance data queried successfully",
        data: {
            instance: instance,
            service: instance.service
        }
    })
}

const unregisterInstance = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const instance_data = req.instance

    const result = await deleteInstance(instance_data)

    if (result instanceof Error) throw result;

    res.status(200).send({
        success: true,
        message: 'Instance unregistered successfully',
        data: null
    })
}

export {
    registerService,
    unregisterService,
    getServices,
    getService,
    unregisterInstance
}

export default {
    registerService,
    unregisterService,
    getServices,
    getService,
    unregisterInstance
}