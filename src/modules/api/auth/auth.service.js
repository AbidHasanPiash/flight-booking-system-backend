'use strict';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UsersModel from "../users/users.model.js";
import configuration from "../../../configuration/configuration.js";
import httpStatusConstants from "../../../constant/httpStatus.constants.js";

import createResponse from "../../../utilities/createResponse.js";
import generateUniqueUsername from "../../../utilities/generateUniqueUsername.js";

const registerUser = async ({ email, password }) => {
    // Check if the user already exists
    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
        return createResponse(httpStatusConstants.CONFLICT, 'User already exists with this email');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await UsersModel.create({
        username: await generateUniqueUsername('user'),
        email,
        password: hashedPassword,
    });

    // Validate that the user was successfully added
    if (!newUser || !newUser._id) {
        return createResponse(httpStatusConstants.INTERNAL_SERVER_ERROR, 'Failed to create the user due to a server error');
    }

    return createResponse(httpStatusConstants.CREATED, 'User registered successfully', newUser);
};

const login = async ({ email, password }) => {
    // Check if the user exists
    const existingUser = await UsersModel.findOne({ email });
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

const authService = {
    registerUser,
    login,
};

export default authService;
