import { Router } from "express";
import {
    registerService,
    unregisterService,
} from "../controllers/registry.contoller";

const router = Router()

router
    .post('/register', registerService)

export default router