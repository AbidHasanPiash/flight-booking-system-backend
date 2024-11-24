'use strict';

import adminSchema from "./admin.schema.js";
import adminService from "./admin.service.js";

import handleRequest from "../../../shared/handleRequest.js";

const login = handleRequest(
    adminSchema.loginValidationSchema,
    adminService.login,
    'body'
);

const adminController = {
    login,
};

export default adminController;
