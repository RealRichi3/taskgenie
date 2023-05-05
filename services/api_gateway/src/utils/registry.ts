import { Request } from "express";
import {
    IInstance,
    IInstanceDoc,
    IServiceDoc,
    InstanceWithEmbeddedService,
    WithID,
} from "../types";
import { Instance, Service } from "../models";
import mongoose from "mongoose";
import { BadRequestError } from "./errors";

type ServiceData = {
    name: string;
    version: number;
    protocol: string;
    host: string;
    port: number;
};

async function addServiceToRegistry(service: ServiceData, req: Request) {
    try {
        let new_service: IServiceDoc | null | undefined;
        let new_instance: IInstanceDoc | undefined;
        let existing_instance: IInstanceDoc | undefined | null;
        const existing_service = await Service.findOne({ name: service.name });

        // Check if service has been registered before
        if (!existing_service) {
            // Service hasn't been registered, register and create instance
            new_service = await Service.create(service);
            new_instance = await Instance.create({
                ...service,
                service: new_service,
            });
        } else {
            // Service has been registered,
            // Check if an instance exist for this current request
            existing_instance = await Instance.findOne({
                service: existing_service._id,
                protocol: service.protocol,
                host: service.host,
                port: service.port,
            }).populate('service');

            if (!existing_instance) {
                new_instance = await Instance.create({
                    ...service,
                    service: existing_service._id,
                });
            }
        }

        return new_instance?.populate('service') || existing_instance;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function removeServiceFromRegistry(service_id: mongoose.Types.ObjectId) {
    try {
        const existing_service = await Service.findById(service_id);

        if (!existing_service) {
            throw new Error("Service not found");
        }

        await existing_service.deleteOne();

        // Delete all instances too
        await Instance.deleteMany({ service: service_id });
    } catch (error) {
        throw error;
    }
}

async function deleteInstance(instance_data: InstanceWithEmbeddedService) {
    try {
        const existing_instance = await Instance.findOne({ _id: instance_data._id });

        if (!existing_instance) {
            throw new BadRequestError("Instance not found");
        }

        await existing_instance.deleteOne();
    } catch (error) {
        console.log(error)
        return error;
    }
}

async function getServicesFromRegistry() {
    try {
        const services = await Service.find();

        return services;
    } catch (error) {
        throw error;
    }
}

async function getServiceFromRegistry(service_id: mongoose.Types.ObjectId) {
    try {
        const existing_service = await Service.findById(service_id);

        if (!existing_service) {
            throw new Error("Service not found");
        }

        return existing_service;
    } catch (error) {
        throw error;
    }
}

export {
    addServiceToRegistry,
    removeServiceFromRegistry,
    getServicesFromRegistry,
    getServiceFromRegistry,
    deleteInstance,
};

export default {
    addServiceToRegistry,
    removeServiceFromRegistry,
    getServicesFromRegistry,
    getServiceFromRegistry,
    deleteInstance,
};
