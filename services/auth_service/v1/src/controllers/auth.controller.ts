import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import {
    getAuthCodes, getAuthTokens,
    handleExistingUser, handleUnverifiedUser
} from '../services/auth.service';
import { sendEmail } from '../services/email.service';
import { Email, WithPopulated, UserWithStatus } from '../types';
import { AuthenticatedRequest } from '../types/global';
import { Status, IStatusDoc } from '../models/status.model';
import { User, IUserDoc } from '../models/user.model';
import { AuthCode, BlacklistedToken } from '../models/auth.model';
import { IPasswordDoc, Password } from '../models/password.model';
import { BadRequestError, ForbiddenError, InternalServerError } from '../utils/errors';
import { IUser, IUsers, IUsersDocs, TProfile, TProfileData } from '../models/types/user.types';

/**
 * User signup
 * 
 * @description Creates a new user
 * 
 * @param { email: string, firstname: string, 
 *          lastname: string, password: string, 
 *          role: 'EndUser', 'Admin', 'SuperAdmin'} | Users details
 *  
 * @throws { BadRequestError } If user already exists
 * @throws { BadRequestError } If user is not created
 * @throws { BadRequestError } If user is not verified
 * 
 * @returns { user: IUserDoc, access_token: string }
 * 
 * //TODO: Test admin and super admin signup
 * */
const userSignup = async (req: Request, res: Response, next: NextFunction) => {

    const {
        email, firstname, lastname,
        password, role, address,
        contact_details, name, website, ratings } = req.body;
    const user_info = {
        email: email as Email,
        firstname: firstname as string,
        lastname: lastname as string,
        password: password as string,
        role: role as IUser['role'],
        address: address as string,
        name: name as string,
        ratings: ratings as 0 | 1 | 2 | 3 | 4 | 5,
        website: website as string,
        contact_details: contact_details as string,
    };

    // Check if user already exists
    type UserWithStatus = WithPopulated<IUserDoc, 'status', IStatusDoc>;
    const existing_user_d = await User.findOne({ email }).populate<UserWithStatus>('status');
    const existing_user: UserWithStatus | undefined = existing_user_d?.toObject();

    if (existing_user) return await handleExistingUser(existing_user, res, next);

    // Create new user in session
    let user: IUserDoc | undefined;
    const session = await mongoose.startSession()
    await session.withTransaction(async () => {
        // Create user
        user = (await User.create([user_info], { session }))[0]
        
        if (user) {
            type R = typeof user.role;
            const profile_data = { ...user.toObject({ virtuals: true }), ...user_info } as TProfileData<R>
            
            type TUserWithStrictRole = IUsersDocs[R];
            type U = WithPopulated<TUserWithStrictRole, 'profile', TProfile<R>>;
            const user_profile = user as U ;

            // Create users profile
            const profile = await user_profile.createProfile<U>(profile_data , session);

            console.log(profile)

            // Create password
            await Password.create([{ user: user._id, password }], { session });
        }

        await session.commitTransaction();
        session.endSession();
    });

    // If user is not created throw error
    if (!user) throw new BadRequestError('An error occurred');

    // Get access token
    const populated_user: UserWithStatus = await user.populate<UserWithStatus>('status')
    console.log('handleUnverifiedUser')
    return await handleUnverifiedUser(populated_user.toObject(), res);
};

/**
 * Resend verification email
 * 
 * @description Resends verification email to user
 * 
 * @param { email: string } | User email
 * 
 * @throws { BadRequestError } If user does not exist
 * @throws { BadRequestError } If user's email is already verified
 * 
 * @returns { user: IUserDoc, access_token: string }
 */
const resendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
    const email: Email = req.query.email as Email;

    // Get user
    const user: IUserDoc & { status: IStatusDoc } | null
        = await User.findOne({ email }).populate('status');

    // Check if user exists
    if (!user) return next(new BadRequestError('User does not exist'));

    // Check if user is unverified
    user.status?.isVerified
        ? next(new BadRequestError("User's email already verified"))
        : await handleUnverifiedUser(user.toObject(), res);
}

const verifyUserEmail = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const verification_code: number = req.body.verification_code;

    // Get user
    const user = req.user

    if (user.status.isVerified) return next(new BadRequestError('User already verified'));

    // Check if verification code is correct
    const auth_code = await AuthCode.findOne({ user: user._id, });

    if (auth_code?.verification_code !== verification_code) {
        return next(new BadRequestError('Invalid verification code'))
    }

    // Verify user
    await Status.findOneAndUpdate({ user: user._id }, { isVerified: true });

    await auth_code.updateOne({ verification_code: undefined })

    // Blacklist access token
    await BlacklistedToken.create({ token: req.headers.authorization.split(' ')[1] })

    res.status(200).send({
        status: 'success',
        message: 'User verified',
        data: {
            user: { ...user, status: undefined },
        },
    });
}

/**
 * Forgot password
 * 
 * @description Sends password reset code to user
 * 
 * @param { email: string } | User email
 * 
 * @throws { BadRequestError } If user does not exist
 * 
 * @returns { user: IUserDoc, access_token: string }
 */
const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const email: Email = req.body.email;

    // Get user
    const user: UserWithStatus | null = await User.findOne({ email }).populate('status');

    // Check if user exists
    if (!user) return next(new BadRequestError('User does not exist'));

    // Get password reset code
    const { password_reset_code }: { password_reset_code: number } =
        await getAuthCodes<'password_reset'>(user, 'password_reset');

    console.log(password_reset_code)
    // Send password reset email
    sendEmail({
        to: email,
        subject: 'Reset your password',
        text: `Your password reset code is ${password_reset_code}`,
    });

    // Get access token
    const { access_token }: { access_token: string } = await getAuthTokens(user.toObject(), 'password_reset');

    return res.status(200).send({
        status: 'success',
        message: 'Password reset code sent to user email',
        data: {
            user: { ...user.toObject(), status: undefined },
            access_token,
        },
    });
}

/**
 * Reset password
 * 
 * @description Resets user password
 * 
 * @param { password_reset_code: number, new_password: string } | Password reset code and new password
 * 
 * @throws { BadRequestError } If password reset code is incorrect
 * @throws { InternalServerError } If password is not updated
 * 
 * @returns { user: IUserDoc, access_token: string }
 */
const resetPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { password_reset_code, new_password } = req.body;

    // Check if password reset code is correct
    const auth_code = await AuthCode.findOne({ user: req.user._id, password_reset_code });

    if (!auth_code) return next(new BadRequestError('Invalid password reset code'));

    // Update password
    const password = await Password.findOne({ user: req.user._id });

    password
        ? await password.updatePassword(new_password)
        : next(new InternalServerError('An error occurred'));

    // Blacklist access token
    await BlacklistedToken.create({ token: req.headers.authorization.split(' ')[1] });

    res.status(200).send({
        status: 'success',
        message: 'Password reset successful',
        data: {
            user: { ...req.user, status: undefined },
        },
    });
}

/**
 * Login
 * 
 * @description Logs user in
 * 
 * @param { email: string, password: string } | User email and password
 * 
 * @throws { BadRequestError } If user does not exist
 * @throws { BadRequestError } If user is not verified
 * @throws { BadRequestError } If user is not activated
 * @throws { BadRequestError } If password is incorrect
 * 
 * @returns { user: IUserDoc, access_token: string, refresh_token: string }
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Get user
    type UserWithStatusAndPassword = UserWithStatus & { password: IPasswordDoc }
    const user: UserWithStatusAndPassword | null = await User.findOne({ email }).populate('status password')

    // Check if user exists
    if (!user) return next(new BadRequestError('User does not exist'));

    // Check if user is verified
    if (!user.status.isVerified) return next(new BadRequestError('User is not verified'));
    if (!user.status.isActive) return next(new BadRequestError('User is not activated'));

    // Check if password is correct
    const is_correct = await user.password.comparePassword(password);

    if (!is_correct) return next(new BadRequestError('Incorrect password'));

    // Get access token
    const { access_token, refresh_token } = await getAuthTokens(user.toObject(), 'access');

    return res.status(200).send({
        status: 'success',
        message: 'User logged in',
        data: {
            user: { ...user.toObject(), status: undefined, password: undefined },
            access_token,
            refresh_token
        },
    });
}

/**
 * Logout
 * 
 * @description Logs user out
 * 
 * @param { refresh_token: string } | Refresh token
 * @param { access_token: string } | Access token - In request header
 * 
 * @throws { BadRequestError } If refresh token is not provided
 * @throws { BadRequestError } If access token is not provided
 */
const logout = async (req: AuthenticatedRequest, res: Response) => {
    const { authorization } = req.headers;
    const access_token = authorization.split(' ')[1];

    const refresh_token = req.body.refresh_token;

    // Blacklist access token
    await BlacklistedToken.create({ token: access_token });
    await BlacklistedToken.create({ token: refresh_token });

    res.status(200).send({
        status: 'success',
        message: 'User logged out',
        data: null,
    });
}

const deactivateUserAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const email = req.query.email;

    // Deactivate user account
    const user: UserWithStatus | null
        = await User.findOne({ email }).populate<UserWithStatus>('status');

    if (!user) return next(new BadRequestError('User does not exist'));
    if (user.role === 'SuperAdmin') {
        return next(new ForbiddenError('You cannot deactivate a super admin account'));
    }

    user.status.isActive = false;
    await user.status.save();

    res.status(200).send({
        status: 'success',
        data: null
    })
}

const activateUserAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const email = req.query.email;

    // Activate user account 
    const user: UserWithStatus | null
        = await User.findOne({ email }).populate<UserWithStatus>('status');

    if (!user) return next(new BadRequestError('User does not exist'));
    if (user.role === 'SuperAdmin') {
        return next(new ForbiddenError('You cannot activate a super admin account'));
    }

    user.status.isActive = true;
    await user.status.save();

    res.status(200).send({
        status: 'success',
        data: null
    })
}

// const uploadDocumentsForVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
// }

export {
    userSignup,
    resendVerificationEmail,
    verifyUserEmail,
    forgotPassword,
    resetPassword,
    login, logout,
    deactivateUserAccount,
    activateUserAccount
};
