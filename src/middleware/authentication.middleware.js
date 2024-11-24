import jwt from 'jsonwebtoken';

import AdminsModel from "../modules/api/admin/admin.model.js";
import configuration from '../configuration/configuration.js';
import httpStatusConstants from '../constant/httpStatus.constants.js';

import sendResponse from "../utilities/sendResponse.js";

const errorResponses = {
    TokenExpiredError: {
        status: httpStatusConstants.UNAUTHORIZED,
        message: 'Token has expired. Please login again.',
    },
    JsonWebTokenError: {
        status: httpStatusConstants.UNAUTHORIZED,
        message: 'Invalid token. Please login again.',
    },
    MissingAuthorizationToken: {
        status: httpStatusConstants.UNAUTHORIZED,
        message: 'Authorization token is missing or invalid.',
    },
    UserNotFound: {
        status: httpStatusConstants.UNAUTHORIZED,
        message: 'User associated with this token does not exist.',
    },
    InternalServerError: {
        status: httpStatusConstants.INTERNAL_SERVER_ERROR,
        message: 'An error occurred during authentication.',
    },
};

const authenticationMiddleware = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            const { status, message } = errorResponses.MissingAuthorizationToken;
            return sendResponse(res, status, message);
        }

        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, configuration.jwt.secret);

        // Check if the user exists in the database
        const user = await AdminsModel.findById(decoded.id);
        if (!user) {
            const { status, message } = errorResponses.UserNotFound;
            return sendResponse(res, status, message);
        }

        // Attach the user object to the request
        req.user = user;

        next(); // Proceed to the next middleware
    } catch (error) {
        // Handle known token-related errors
        const errorResponse = errorResponses[error.name];
        if (errorResponse) {
            const { status, message } = errorResponse;
            return sendResponse(res, status, message);
        }

        // Handle other errors
        const { status, message } = errorResponses.InternalServerError;
        const errorData = process.env.NODE_ENV === 'development' ? { error: error.message } : {};

        return sendResponse(res, status, message, errorData);
    }
};

export default authenticationMiddleware;
