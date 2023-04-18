import Mongoose from 'mongoose';
import { NodeENV } from '../types';
import * as config from '../config';
import redis, { RedisClientType} from 'redis';

function getDBConnectionString(env: NodeENV): string {
    switch (env) {
        case 'test':
            return config.MONGO_URI_TEST;
        case 'dev':
            return config.MONGO_URI_DEV;
        case 'prod':
            return config.MONGO_URI_PROD;
        default:
            return '';
    }
}

async function initRedisConnection() {
    const redis_url: string = config.REDIS_URI;

    const redis_client: RedisClientType = redis.createClient({
        socket: {
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
        },
        username: config.REDIS_USERNAME,
        password: config.REDIS_PASSWORD,
    });

    redis_client.on('connect', () => {
        console.log(`Connection to REDIS database successful`);
    });

    redis_client.on('error', (err: Error) => {
        console.log(`Error connecting to REDIS database: ${err}`);
    });
}

async function initMongoDBConnection() {
    const mongo_url: string = getDBConnectionString(config.NODE_ENV);

    Mongoose.set('strictQuery', false);
    await Mongoose.connect(mongo_url);

    console.log(`Connection to ${Mongoose.connection.name} MongoDB database successful`);
}

export async function connectToDatabase() {
    await initMongoDBConnection();
    await initRedisConnection();

    return Mongoose.connection;
}
