import fs from 'fs'
import { Request } from 'express'
import { APIService, IInstanceDoc, IServiceDoc, Registry } from '../types'
import { Instance, Service } from '../models'
import wrapper from '../middlewares/async_wrapper'

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
                new_instance = await Instance.create({ ...service, service: existing_service._id})
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

async function removeServiceFromRegistry() { }

async function getServicesFromRegistry() { }

async function getServiceFromRegistry() { }

async function checkIfServiceIsRegistered() { }

export {
    addServiceToRegistry,
    removeServiceFromRegistry,
    getServicesFromRegistry,
    getServiceFromRegistry,
    checkIfServiceIsRegistered
}

export default {
    addServiceToRegistry,
    removeServiceFromRegistry,
    getServicesFromRegistry,
    getServiceFromRegistry,
    checkIfServiceIsRegistered
}

