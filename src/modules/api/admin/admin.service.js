'use strict';

import bcrypt from 'bcrypt';

import configuration from "../../../configuration/configuration.js";

import generateUniqueUsername from "../../../utilities/generateUniqueUsername.js";
import UsersModel from '../users/users.model.js';

const createDefaultAdmin = async () => {
    try {
        const email = configuration.admin.email;
        const password = configuration.admin.password;

        // Check if an admin user already exists
        const adminExists = await UsersModel.exists({ email: email, role: "admin" }).lean();
        if (!adminExists) {
            // Hash a default password
            const hashedPassword = await bcrypt.hash(password, 10);

            console.log(hashedPassword)

            // Create the admin user
            const adminUser = await UsersModel.create({
                username: await generateUniqueUsername('user'),
                email: email,
                password: hashedPassword,
                role: "admin"
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

const adminService = {
    createDefaultAdmin
};

export default adminService;
