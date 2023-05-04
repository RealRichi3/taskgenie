import { Router, Application } from 'express';

import registryRouter from './registry.routes';

export default function routeHandler(app: Application) {
    const router = Router();
    app.use('/host', router);

    router.use('/registry', registryRouter);
}
 