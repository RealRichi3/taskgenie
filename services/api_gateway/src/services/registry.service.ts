import fs from 'fs'
import { Request } from 'express'
import { APIService, IInstanceDoc, IServiceDoc, Registry } from '../types'
import { Instance, Service } from '../models'
import wrapper from '../middlewares/async_wrapper'
import mongoose from 'mongoose'

type ServiceData = {
    name: string;
    version: number;
    protocol: string;
    host: string;
    port: number;
}

async function addServiceToRegistry(service: ServiceData, req: Request) {
    try {
        let new_service: IServiceDoc | null | undefined
        let new_instance: IInstanceDoc | undefined
        let existing_instance: IInstanceDoc | undefined | null
        const existing_service = await Service.findOne({ name: service.name })

        // Check if service has been registered before
        if (!existing_service) {
            // Service hasn't been registered, register and create instance
            new_service = await Service.create(service);
            new_instance = await Instance.create({ ...service, service: new_service })
        } else {
            // Service has been registered,
            // Check if an instance exist for this current request
            existing_instance = await Instance.findOne(
                {
                    service: existing_service._id,
                    protocol: service.protocol,
                    host: service.host,
                    port: service.port
                })

            if (!existing_instance) {
                new_instance = await Instance.create({ ...service, service: existing_service._id })
            }
        }

        console.log(existing_service)
        console.log(new_service)
        return new_instance || existing_instance
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function removeServiceFromRegistry(service_id: mongoose.Types.ObjectId) {
    try {
        const existing_service = await Service.findById(service_id)

        if (!existing_service) {
            throw new Error('Service not found')
        }

        await existing_service.deleteOne()

        // Delete all instances too

        await Instance.deleteMany({ service: service_id })

    } catch (error) {
        throw error
    }
}

async function unregisterInstance(instance_id: mongoose.Types.ObjectId) {
    try {
        const existing_instance = await Instance.findById(instance_id)

        if (!existing_instance) {
            throw new Error('Instance not found')
        }

        await existing_instance.deleteOne()
    } catch (error) {
        throw error
    }
}

async function getServicesFromRegistry() {
    try {
        const services = await Service.find()

        return services
    } catch (error) {
        throw error
    }
 }

async function getServiceFromRegistry(service_id: mongoose.Types.ObjectId) { 
    try {
        const existing_service = await Service.findById(service_id)

        if (!existing_service) {
            throw new Error('Service not found')
        }

        return existing_service
    } catch (error) {
        throw error   
    }
}


export {
    addServiceToRegistry,
    removeServiceFromRegistry,
    getServicesFromRegistry,
    getServiceFromRegistry,
    unregisterInstance
}

export default {
    addServiceToRegistry,
    removeServiceFromRegistry,
    getServicesFromRegistry,
    getServiceFromRegistry,
    unregisterInstance
}

