import { Router } from 'express'
import {
    addProcedureToDoctorProfile,
    createDoctorProfile,
    deleteDoctorProfile,
    getDoctorProfile,
    getDoctorsProfiles,
    removeProcedureFromDoctorProfile,
    updateDoctorProfile
} from '../controllers/care_giver.controller';
import { basicAuth, withAuthentication } from '../middlewares/auth';
import permit from '../middlewares/rbac_handler'

const router = Router()

router.use(basicAuth(), permit(['CareGiver']))

router
    .post('/doctor/new', withAuthentication(createDoctorProfile))
    .get('/doctor', withAuthentication(getDoctorsProfiles))
    .get('/doctor/data', withAuthentication(getDoctorProfile))
    .patch('/doctor/update', withAuthentication(updateDoctorProfile))
    .delete('/doctor/delete', withAuthentication(deleteDoctorProfile))
    .post('/doctor/procedure/add', withAuthentication(addProcedureToDoctorProfile))
    .delete('/doctor/procedure/remove', withAuthentication(removeProcedureFromDoctorProfile))

export default router
