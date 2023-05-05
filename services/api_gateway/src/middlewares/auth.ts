import { Request, Response, NextFunction } from 'express';
import { UnauthenticatedError } from '../utils/errors';
import { IInstance, IService, PopulateEmbeddedDoc } from '../types';
import * as config from '../config';
import * as jwt from 'jsonwebtoken';
// import { BlacklistedToken } from '../models/auth.model';
import { AuthenticatedAsyncController, AuthenticatedRequest } from '../types';

type InstanceWithEmbeddedService = PopulateEmbeddedDoc<IInstance, 'service', IService>
/**
 * Basic Auth
 * 
 * @description Middleware to validate requests made to protected routes
 * 
 * @param token_type:  Type of validation 
 * 
 * @returns 
 */
const basicAuth = async (
    req: Request & { instance?: InstanceWithEmbeddedService },
    res: Response, next: NextFunction) => {

    // Get authorization header
    const auth_header = req.headers.authorization;

    // Check if authorization header is present
    if (!auth_header?.startsWith('Bearer'))
        return next(new UnauthenticatedError('Invalid authorization header'));

    const jwt_token = auth_header.split(' ')[1];
    const payload = jwt.verify(jwt_token, config.JWT_ACCESS_SECRET)
    req.instance = payload as InstanceWithEmbeddedService

    console.log(req.instance)
    // if (req.user) {
    //     const saved_token = await getAuthFromCacheMemory({
    //         email: req.user.email,
    //         type: token_type ?? 'access',
    //         auth_class: 'token'
    //     })

    //     if (!saved_token || saved_token !== jwt_token) {
    //         return next(new UnauthenticatedError('Invalid authentication'))
    //     }
    // }

    next()
};

function withAuthentication(handler: AuthenticatedAsyncController) {
    return async (req: Request, res: Response, next: NextFunction) => {
        return handler(req as AuthenticatedRequest, res, next)
    }
}
export { basicAuth, withAuthentication }
