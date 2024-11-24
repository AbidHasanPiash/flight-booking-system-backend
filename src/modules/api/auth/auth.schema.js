'use strict';

import { z } from "zod";
import constants from "../../../constant/constants.js";

const emailValidation = z.string()
    .nonempty("Email is required")
    .email("Invalid email address");

const passwordValidation = z.string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must not exceed 64 characters")
    .regex(constants.uppercaseRegex, "Password must contain at least one uppercase letter")
    .regex(constants.lowercaseRegex, "Password must contain at least one lowercase letter")
    .regex(constants.numberRegex, "Password must contain at least one digit")
    .regex(constants.specialCharacterRegex, `Password must contain at least one special character (${constants.specialCharacters})`);

const confirmPasswordValidation = z.string()
    .nonempty("Confirm password is required");

const registrationValidationSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
}, { strict: true }) // Ensure strict validation here
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'], // Specify the path of the error
        message: "Passwords do not match", // Custom error message
    });

const loginValidationSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
}).strict(); // Disallow additional unexpected keys

const authSchema = {
    registrationValidationSchema,
    loginValidationSchema,
};

export default authSchema;
