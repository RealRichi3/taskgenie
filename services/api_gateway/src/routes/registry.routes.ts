import { Router } from "express";
import {
    registerService,
    unregisterService,
} from "../controllers/registry.contoller";
import schema from './schema'
import routerValidator from '../middlewares/router_schema_validator'
import { basicAuth, withAuthentication } from "../middlewares/auth";
const router = Router()

router
    .post('/register', routerValidator(schema.register_service), registerService)
    .post('/unregister', basicAuth(),  withAuthentication(unregisterService))

export default router