import * as z from 'zod';
import { passwordSchema } from './global';

export const userSignup = z.object({
    body: z.object({
        email: z.string().email(),
        firstname: z.string(),
        lastname: z.string(),
        password: passwordSchema,
        role: z.enum(['Patient', 'CareGiver', 'Admin', 'SuperAdmin']),
        // Contact detail is requird for patient and care giver
        contact_details: z.union([z.string(), z.array(z.string())]).optional(),
        // Address is required for patient and care giver
        address: z.string().optional(),
        // Name is required for care giver
        name: z.string().optional(),
        // Website is required for care giver
        website: z.string().optional(),
    })
        .partial()
        .refine((data) => {
            const issues: z.ZodIssue[] = [];
            if (data.role === 'Patient' && !data.contact_details) {
                issues.push({
                    code: z.ZodIssueCode.custom,
                    message: 'Path `contact_details` is required for patient',
                    path: ['body', 'contact_details'],
                });
            }

            if (data.role === 'CareGiver') {
                !data.name && issues.push({
                    code: z.ZodIssueCode.custom,
                    message: 'Path `name` is required for care giver',
                    path: ['body', 'name'],
                });

                !data.website && issues.push({
                    code: z.ZodIssueCode.custom,
                    message: 'Path `website` is required for care giver',
                    path: ['body', 'website'],
                });

                !data.contact_details && issues.push({
                    code: z.ZodIssueCode.custom,
                    message: 'Path `contact_details` is required for care giver',
                    path: ['body', 'contact_details'],
                });
            }

            if (issues.length > 0) throw new z.ZodError(issues);

            return true
        })
});

export const resendVerificationEmail = z.object({
    query: z.object({
        email: z.string().email(),
    }),
});
export const verifyUserEmail = z.object({
    body: z.object({
        verification_code: z.number(),
    }),
});
