import { Router } from "express";
import {
    registerService,
    unregisterService,
} from "../controllers/registry.contoller";
import schema from './schema'
import routerValidator from '../middlewares/router_schema_validator'

const router = Router()

router
    .post('/register', routerValidator(schema.register_service), registerService)

export default router