import * as z from 'zod';

const register_service = z.object({
    body: z.object({
        protocol: z.string(),
        host: z.string(),
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