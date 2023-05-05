import { Router } from "express";
import {
    registerService,
    unregisterService,
    unregisterInstance,
    getService,
    getServices
} from "../controllers/registry.contoller";
import schema from './schema'
import routerValidator from '../middlewares/router_schema_validator'
import { basicAuth, withAuthentication } from "../middlewares/auth";

const router = Router()

router
    .post('/service/register', routerValidator(schema.register_service), registerService)
    .post('/service/unregister', basicAuth, withAuthentication(unregisterService))
    .post('/instance/unregister', basicAuth, withAuthentication(unregisterInstance))
    .get('/data', basicAuth, withAuthentication(getService))
    .get('/services', getServices)

export default router