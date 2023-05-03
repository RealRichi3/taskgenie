import { Router, Application } from 'express';

import authRoute from './registry.routes';

export default function routeHandler(app: Application) {
    const router = Router();
    app.use('/host', router);

    router.use('/registry', authRoute);
}
 