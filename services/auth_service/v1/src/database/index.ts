import Mongoose from 'mongoose';
import { NodeENV } from '../types';
import * as config from '../config';
import redis, { RedisClientType } from 'redis';
import { Client } from 'redis-om'
import { REDIS_URL } from '../config'

const redis_client = new Client()

function getDBConnectionString(env: NodeENV): string {
    switch (env) {
        case 'test':
            return config.MONGO_URI_TEST;
        case 'dev':
            return config.MONGO_URI_DEV;
        case 'prod':
            return config.MONGO_URI_PROD;
    }
}

async function initRedisConnection() {
    try {
        await redis_client.open(REDIS_URL)
        console.log(`Connection to REDIS database successful`);
    } catch (error) {
        console.log(`Error connecting to REDIS database: ${error}`);
        process.exit(1);
    }
}

async function initMongoDBConnection() {
    const mongo_url: string = getDBConnectionString(config.NODE_ENV);

    Mongoose.set('strictQuery', false);
    await Mongoose.connect(mongo_url);

    console.log(`Connection to ${Mongoose.connection.name} MongoDB database successful`);
}

export async function connectToDatabase() {
    await initRedisConnection();
    await initMongoDBConnection();

    return Mongoose.connection;
}
