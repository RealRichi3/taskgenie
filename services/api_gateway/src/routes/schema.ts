import * as z from 'zod';
import { NODE_ENV } from '../config';

const register_service = z.object({
    body: z.object({
        protocol: z.string(),
        host: z.string(),
        port: z.number(),
        name: z.string(),
        version: z.string(),
    }).refine((data) => {
        if (data.protocol !== 'https' && NODE_ENV !== 'dev') {
            return false
        }
        return true
    }, {
        message: 'Protocol must be https',
        path: ['protocol']
    })
});

export default {
    register_service
}

export {
    register_service
}