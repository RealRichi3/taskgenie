import { Router, Application, Request, Response, NextFunction } from 'express';

import registryRouter from './registry.routes';
import axios from 'axios';
import { Service } from '../models';
import { IInstanceDoc, IServiceDoc, PopulateVirtualDoc } from '../types';
import { NotFoundError } from '../utils/errors';

async function microserviceRouter(req: Request, res: Response, next: NextFunction) {
    console.log(req.originalUrl)
    const api_name = req.originalUrl.split('/')[2]
    const dest = req.originalUrl.split('/host/' + api_name)[1]
    console.log(api_name)

    type ServiceWithInstance = PopulateVirtualDoc<IServiceDoc, 'instances', IInstanceDoc[]>
    const service =
        await Service
            .findOne({ name: api_name })
            .populate<ServiceWithInstance>('instances')

    console.log(api_name)
    console.log(service?.toObject())
    if (!service || !service.instances) {
        return next(new NotFoundError('Service not found'))
    }

    const destination_url = service.instances[0].url + dest
    console.log(destination_url)
    const response =
        await axios({
            method: req.method,
            url: destination_url,
            data: req.body,
            headers: req.headers
        })
            .then(res => res)
            .catch(err => err)
    
    console.log(response)
    res.status(response.response.status).send(response.response.data)
}

export default function routeHandler(app: Application) {
    const router = Router();
    app.use('/host', router);

    router.use('/registry', registryRouter);
    router.use('/', microserviceRouter);
}
