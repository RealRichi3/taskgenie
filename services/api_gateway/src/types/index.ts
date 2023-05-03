import mongoose from "mongoose";
import { MongoServerError } from 'mongodb';
import { Request } from 'express';


type MongoDuplicateKeyError = MongoServerError & {
    code: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keyValue?: { [key: string]: any };
};

type NodeENV = 'dev' | 'test' | 'prod';

type Prettify<T> {
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

interface IService {
    name: string;
    version: number;
    path: string;
}
interface IServiceDoc extends IService, Document { }

interface IInstance {
    service_id: mongoose.Types.ObjectId;
    protocol: string;
    host: string;
    url: string;
    port: number;
    last_heartbeat: Date;
}
interface IInstanceDoc extends IInstance, Document { }

export {
    NodeENV,
    Prettify,
    APIService,
    IService, IServiceDoc,
    IInstance, IInstanceDoc, 
    MongoDuplicateKeyError
}