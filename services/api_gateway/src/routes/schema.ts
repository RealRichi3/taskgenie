import * as z from 'zod';
import { NODE_ENV } from '../config';

const register_service = z.object({
    body: z.object({
        port: z.number(),
        name: z.string(),
        version: z.string(),
    })
});

export default {
    register_service
}

export {
    register_service
}