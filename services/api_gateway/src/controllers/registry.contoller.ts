import { Request, Response, NextFunction } from 'express';
import Registry, { addServiceToRegistry } from '../services/registry.service'

const registerService = async (req: Request, res: Response, next: NextFunction) => {
    const {
        protocol, host, port, name, version
    } = req.body

    const service =
        await addServiceToRegistry(
            { protocol, host, port, name, version },
            req
        )

    console.log(service)

    if (!service) {
        return res.status(500).json({
            message: "Service could not be registered"
        })
    }

    return res.status(200).json({
        message: "Service registered successfully",
        service
    })
}

const unregisterService = async (req: Request, res: Response, next: NextFunction) => {
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