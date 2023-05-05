import { Request, Response, NextFunction } from 'express';
import Registry, { addServiceToRegistry } from '../utils/registry'
import { encodeData } from '../utils/jwt';
import { AuthenticatedRequest } from '../types';

const registerService = async (req: Request, res: Response, next: NextFunction) => {
    const {
        protocol, host, port, name, version
    } = req.body

    const service =
        await addServiceToRegistry(
            { protocol, host, port, name, version },
            req
        )

    if (!service) {
        return res.status(500).json({
            message: "Service could not be registered"
        })
    }

    const api_key = await encodeData(service.toObject())

    res.status(200).json({
        message: "Service registered successfully",
        data: {
            service,
            api_key
        }
    })
}

const unregisterService = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {


    res.status(200).json({
        message: "Service unregistered successfully",
        data: {
        }
    })
}

const getServices = async (req: Request, res: Response, next: NextFunction) => {
}

const getService = async (req: Request, res: Response, next: NextFunction) => {
}

const checkService = async (req: Request, res: Response, next: NextFunction) => {
}

export {
    registerService,
    unregisterService,
    getServices,
    getService,
    checkService
}

export default {
    registerService,
    unregisterService,
    getServices,
    getService,
    checkService
}