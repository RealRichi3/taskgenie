import mongoose, { Document } from "mongoose";
import { MongoServerError } from 'mongodb';
import { Request, Response, NextFunction } from 'express';

type MongoDuplicateKeyError = MongoServerError & {
    code: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keyValue?: { [key: string]: any };
};

type NodeENV = 'dev' | 'test' | 'prod';

type Prettify<T> = {
    [k in keyof T]: T[k];
}

interface APIService<T extends Boolean = true> {
    api_name: string;
    version: number;
    protocol: string;
    host: string;
    port: number;
    url: T extends true ? string : never
}

interface APIServiceDoc extends APIService, Document, { }

interface Registry {
    services: {
        [k: string]: APIService<true>[]
    }
}

interface IService {
    name: string;
    version: number;
    path: string;
}
interface IServiceDoc extends IService, Document { }

interface IInstance {
    service: mongoose.Types.ObjectId;
    protocol: string;
    host: string;
    url: string;
    port: number;
    last_heartbeat: Date;
}
interface IInstanceDoc extends IInstance, Document { }
type InstanceWithEMbeddedServiceDoc = PopulateEmbeddedDoc<IInstanceDoc, 'service', IServiceDoc>

type PopulateVirtualDoc<T, K extends string, U> = {
    [k in keyof Omit<T, K>]: T[k];
} & { [key in K]: U | null }

type PopulateEmbeddedDoc<T, K extends keyof T, U> = {
    [k in keyof Omit<T, K>]: T[k];
} & { [key in K]: U }

interface AuthenticatedRequest extends Request {
    headers: {
        authorization: string
    },
    instance: InstanceWithEMbeddedServiceDoc
}

interface AuthenticatedAsyncController {
    (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>
}

export {
    NodeENV,
    Prettify,
    APIService, Registry,
    IService, IServiceDoc,
    IInstance, IInstanceDoc,
    MongoDuplicateKeyError,
    PopulateEmbeddedDoc, PopulateVirtualDoc,
    AuthenticatedAsyncController, AuthenticatedRequest
}