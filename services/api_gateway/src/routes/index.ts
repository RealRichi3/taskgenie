import { Router, Application, Request, Response, NextFunction } from 'express';

import registryRouter from './registry.routes';
import axios from 'axios';
import { Service } from '../models';
import { IInstanceDoc, IServiceDoc, PopulateVirtualDoc } from '../types';
import { NotFoundError } from '../utils/errors';

async function proxyRequest(req: Request, res: Response, next: NextFunction) {
    // Get the name of the API to be called
    const api_name = req.originalUrl.split('/')[2]

    // Get the destination URL
    const dest = req.originalUrl.split('/host/' + api_name)[1]

    type ServiceWithInstance =
        PopulateVirtualDoc<IServiceDoc, 'instances', IInstanceDoc[]>

    // Get the service from the database
    const service =
        await Service
            .findOne({ name: api_name })
            .populate<ServiceWithInstance>('instances')

    if (!service || !service.instances) {
        return next(new NotFoundError('Service not found'))
    }

    const destination_url = service.instances[0].url + dest

    // Make the request to the destination URL
    const response =
        await axios({
            method: req.method,
            url: destination_url,
            data: req.body,
            headers: req.headers
        })
            .then(res => res)
            .catch(err => err)

    res.status(response.response.status).send(response.response.data)
}

export default function routeHandler(app: Application) {
    const router = Router();
    app.use('/host', router);

    router.use('/registry', registryRouter);
    router.use('/', proxyRequest);
}
