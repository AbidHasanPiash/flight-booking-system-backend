'use strict';

import authService from './auth.service.js';
import authSchema from "./auth.schema.js";

import handleRequest from "../../../shared/handleRequest.js";

const registration = handleRequest(
    authSchema.registrationValidationSchema,
    authService.registerUser,
    'body'
);

const login = handleRequest(
    authSchema.loginValidationSchema,
    authService.login,
    'body'
);

const authController = {
    registration,
    login,
};

export default authController;
