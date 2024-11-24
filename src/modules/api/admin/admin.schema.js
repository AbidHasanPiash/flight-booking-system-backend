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

const loginValidationSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
}).strict(); // Disallow additional unexpected keys

const adminSchema = {
    loginValidationSchema,
};

export default adminSchema;
