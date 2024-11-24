'use strict';

import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

import AdminsModel from "./admin.model.js";
import configuration from "../../../configuration/configuration.js";
import httpStatusConstants from "../../../constant/httpStatus.constants.js";

import generateUniqueUsername from "../../../utilities/generateUniqueUsername.js";
import createResponse from "../../../utilities/createResponse.js";

const createDefaultAdmin = async () => {
    try {
        const email = configuration.admin.email;
        const password = configuration.admin.password;

        // Check if an admin user already exists
        const adminExists = await AdminsModel.exists({ email: email }).lean();
        if (!adminExists) {
            // Hash a default password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the admin user
            const adminUser = await AdminsModel.create({
                username: await generateUniqueUsername('admin'),
                email: email,
                password: hashedPassword,
            });

            if (!adminUser._id) {
                console.error('Error creating default admin user.');
            } else {
                console.info(`Default admin user created: ${adminUser.email}`);
            }
        } else {
            console.info(`Default admin user with email "${email}" already exists.`);
        }
    } catch (error) {
        console.error(`Error creating default admin user: ${error.message}`);
    }
};

const login = async ({ email, password }) => {
    // Check if the user exists
    const existingUser = await AdminsModel.findOne({ email });
    if (!existingUser) {
        return createResponse(httpStatusConstants.UNAUTHORIZED, 'Invalid email or password.');
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        return createResponse(httpStatusConstants.UNAUTHORIZED, 'Invalid email or password.');
    }

    const data = {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role
    };

    // Generate a JWT token for the user
    const token = jwt.sign(data, configuration.jwt.secret, { expiresIn: '1h' });

    return createResponse(httpStatusConstants.OK, 'User login successfully', {
        email: existingUser.email,
        username: existingUser.username,
        role: existingUser.role,
        token,
    });
};

const adminService = {
    createDefaultAdmin,
    login,
};

export default adminService;
