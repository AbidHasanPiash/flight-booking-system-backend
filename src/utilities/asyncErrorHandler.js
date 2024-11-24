'use strict';

import { ZodError } from 'zod';

import httpStatusConstants from "../constant/httpStatus.constants.js";
import configuration from "../configuration/configuration.js";
import envTypesConstants from "../constant/envTypes.constants.js";

// Utility to handle Zod errors
const handleZodError = (error) => ({
    timestamp: new Date(),
    status: httpStatusConstants.BAD_REQUEST,
    message: "Date validation error occurred.",
    errors: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
    })),
});

// Utility to handle ReferenceError
const handleReferenceError = (error) => {
    const response = {
        timestamp: new Date(),
        status: httpStatusConstants.INTERNAL_SERVER_ERROR,
        message: "A server error occurred. Code: REFERENCE_ERROR",
    };

    if (configuration.env === envTypesConstants.DEVELOPMENT) {
        response.errors = {
            name: error.name,
            message: error.message,
            stack: error.stack,
        };
    }

    return response;
};

// Generic error handler
const handleGenericError = (error) => {
    const response = {
        timestamp: new Date(),
        status: httpStatusConstants.INTERNAL_SERVER_ERROR,
        message: "An unexpected error occurred.",
    };

    if (configuration.env === envTypesConstants.DEVELOPMENT) {
        response.errors = {
            name: error.name,
            message: error.message,
            stack: error.stack,
        };
    }

    return response;
};

const asyncErrorHandlerService = (fn) => async (req, res, next) => {
    try {
        // Await the execution of the passed-in function
        await fn(req, res, next);
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof ZodError) {
            const errorResponse = handleZodError(error);
            return res.status(errorResponse.status).json(errorResponse);
        }

        // Handle ReferenceError
        if (error instanceof ReferenceError) {
            const errorResponse = handleReferenceError(error);
            return res.status(errorResponse.status).json(errorResponse);
        }

        // Handle all other errors
        const errorResponse = handleGenericError(error);
        res.status(errorResponse.status).json(errorResponse);

        // Pass other errors to the next error-handling middleware
        next(error);
    }
};

export default asyncErrorHandlerService;
