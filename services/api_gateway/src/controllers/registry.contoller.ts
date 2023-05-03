import { Request, Response, NextFunction } from 'express';
import Registry from '../services/registry.service'

const registerService = async (req: Request, res: Response, next: NextFunction) => {
    const {
        protocol, host, port, api_name, version
    } = req.body

    const service = {
        protocol, host, port, api_name, version
    }

    
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