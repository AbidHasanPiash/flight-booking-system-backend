import { z } from 'zod';

// Validation for individual fields
const email = z.string().optional();
const password = z.string().optional();

// Update User Schema
const updateProfileSchema = z
    .object({
        email,
        password,
    })
    .strict() // Ensures no additional fields are passed
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: "At least one of 'email' or 'password' must be provided.",
        }
    );

const profileSchema = {
    updateProfileSchema,
};

export default profileSchema;
