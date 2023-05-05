/* eslint-disable @typescript-eslint/no-unused-vars */
import 'express-async-errors';
import axios from 'axios'
import express, { Application, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { NODE_ENV, PORT, REGISTRY_SERVICE } from './config';
import errorHandler from './middlewares/error_handler';
import routeHandler from './routes';
import cookieParser from 'cookie-parser';
import { Server } from 'http';

/**
 * Init Middlewares
 *
 * @description Initializes Express middlewares
 *
 * @param {Application} app - Express Server Application
 *
 * @returns {void}
 */
function initMiddlewares(app: Application): void {
    NODE_ENV == 'dev' ? app.use(morgan('dev')) : null;
    app.use(express.json())
    app.use(cors());
}

/**
 * Init Express Route Handler
 *
 * @description Initializes express route handlers
 * @param app Express Server Application
 *
 * @returns {void}
 */
function initExpressRouteHandler(app: Application): void {
    // app.get('/', (req: Request, res: Response, next: NextFunction) => {
    //     res.status(200).send({
    //         message: 'Welcome to Ride APP API built by molunorichie@gmail.com',
    //     });
    // });

    app.use(cookieParser())

    /** Initialize Route Handler
     *
     * Route handler directs requests to handlers
     * based on the route prefix:
     * */
    routeHandler(app);

    app.use(errorHandler);

    app.all('*', (req: Request, res: Response, _next: NextFunction) => {
        res.status(404).send({
            status: 'error',
            message: 'Route not found',
        });
    });

    return
}

export const app: Application = express();

/**
 * Start Express server
 *
 * @description Initializes middlewares, and route handlers then starts server
 *
 */
export async function startExpressServer({ register_service = false }) {
    try {
        initMiddlewares(app);

        initExpressRouteHandler(app);

        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`);
        });

        const response =
            register_service
                ? await registerService(server)
                : null

        if (response instanceof Error) throw response;

    } catch (error) {
        console.log(error)
        console.log('Shutting down server')

        process.exit(0)
    }
}

async function registerService(server: Server) {
    try {
        const service_data = {
            protocol: server.address(),
            port: PORT,
            name: 'auth',
            version: '1'
        }

        const registry_res =
            await axios
                .post(REGISTRY_SERVICE + '/host/registry/service/register', service_data)
                .then(res => res)
                .catch(err => err)

        console.log(registry_res.data)
    } catch (error) {
        console.log(error)
        return error
    }
}