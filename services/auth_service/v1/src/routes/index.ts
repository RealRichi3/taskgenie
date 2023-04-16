import { Router, Application } from 'express';

import authRoute from './auth.routes';
import procedureRoute from './procedure.routes'
import careGiverRoute from './care_giver.routes'

export default function routeHandler(app: Application) {
    const router = Router();
    app.use('/api/v1', router);

    router.use('/auth', authRoute);
    router.use('/procedure', procedureRoute);
    router.use('/caregiver', careGiverRoute);
}
 