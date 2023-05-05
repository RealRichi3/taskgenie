import * as z from 'zod';

export const userSignup = z.object({
    body: z.object({
        email: z.string().email(),
        firstname: z.string(),
        lastname: z.string(),
        password: passwordSchema,
        role: z.enum(['EndUser', 'Admin', 'SuperAdmin']),
        // Should only be required if user is EndUser
        signup_purpose: z.enum([
            'networking', 'partnership',
            'sponsorship', 'support',
            'learn', 'other'
        ]).optional(),
    }).refine((data) => {
        if (data.role === 'EndUser' && !data.signup_purpose) {
            return false;
        }
        return true;
    }, {
        message: 'Signup purpose is required for EndUser',
        path: ['signup_purpose'],
    })
});
export const resendVerificationEmail = z.object({
    body: z.object({
        email: z.string().email(),
    }),
});
export const verifyUserEmail = z.object({
    body: z.object({
        verification_code: z.number(),
    }),
});

// Business listing route schema
export const createBusinessListing = z.object({
    body: z.object({
        business_name: z.string(),
        business_description: z.string(),
        business_website: z.string(),
        business_email: z.string().email(),
        phone: z.string(),
        contact_person_name: z.string(),
        interests: z.array(z.string()),
        industry: z.string(),
        city: z.string(),
        province: z.string(),
        social_links: z.object({
            facebook: z.string().optional(),
            linkedin: z.string().optional(),
            twitter: z.string().optional(),
            instagram: z.string().optional(),
            youtube: z.string().optional(),
        }).optional(),
        extra_info: z.optional(z.object({}))
    })
});
export const updateBusinessListing = z.object({
    body: z.object({
        business_name: z.string().optional(),
        business_description: z.string().optional(),
        business_website: z.string().optional(),
        business_email: z.string().email().optional(),
        phone: z.string().optional(),
        contact_person_name: z.string().optional(),
        interests: z.array(z.string()).optional(),
        industry: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        extra_info: z.object({}).optional(),
    }).refine((data) => {
        const keys = Object.keys(data) as Array<keyof typeof data>;
        return keys.some((key) => data[key] !== undefined);
    }, { message: "At least one parameter must be present in the body" }),

    query: z.object({
        // use regex to validate mongo id
        business_id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    })
});
export const deleteBusinessListing = z.object({
    query: z.object({
        // use regex to validate mongo id
        business_id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
})
export const getBusinessListing = z.object({
    query: z.object({
        business_id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
});
export const getBusinessListings = z.object({
    query: z.object({
        user: z.optional(z.string()),
        business_name: z.optional(z.string()),
        business_website: z.optional(z.string()),
        business_email: z.optional(z.string()),
        phone: z.optional(z.string()),
        contact_person_name: z.optional(z.string()),
        interests: z.optional(z.string()),
        city: z.optional(z.string()),
        province: z.optional(z.string()),
        industry: z.optional(z.string()),
    }),
});

export const createBusinessSocialLinks = z.object({
    body: z.object({
        facebook: z.string(),
        twitter: z.string(),
        instagram: z.string(),
        linkedin: z.string(),
        youtube: z.string(),
    }),
});
export const updateBusinessSocialLinks = z.object({
    body: z.object({
        facebook: z.string(),
        twitter: z.string(),
        instagram: z.string(),
        linkedin: z.string(),
        youtube: z.string(),
    }),
});
