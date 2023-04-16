import { Router } from 'express';
import permit from '../middlewares/rbac_handler'
import { basicAuth, withAuthentication } from '../middlewares/auth';
import {
    addNewProcedure,
    getProcedures,
    getProcedure,
    updateProcedure,
    deleteProcedure
} from '../controllers/procedures.controller';

const router = Router();

router.use(basicAuth());

router
    .post('/new', permit(['CareGiver']), withAuthentication(addNewProcedure))
    .get('/', permit(['SuperAdmin', 'Patient', 'CareGiver']), withAuthentication(getProcedures))
    .get('/data', permit(['SuperAdmin', 'Patient', 'CareGiver']), withAuthentication(getProcedure))
    .patch('/update', permit(['SuperAdmin', 'CareGiver']), withAuthentication(updateProcedure))
    .delete('/delete', permit(['SuperAdmin', 'CareGiver']), withAuthentication(deleteProcedure));

export default router;