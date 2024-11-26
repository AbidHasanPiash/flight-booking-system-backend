import profileService from "./profile.service.js";

import asyncErrorHandlerService from "../../../utilities/asyncErrorHandler.js";
import profileSchema from "./profile.schema.js";
import configuration from "../../../configuration/configuration.js";
import jwt from "jsonwebtoken";
import createResponse from "../../../utilities/createResponse.js";
import httpStatusConstants from "../../../constant/httpStatus.constants.js";

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

const updateProfile = asyncErrorHandlerService(async (req, res) => {
    console.log(req.body)
    // Validate request data with Zod schema
    // const validatedData = profileSchema.updateProfileSchema.parse(req.body);

    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        const { status, message } = errorResponses.MissingAuthorizationToken;
        return createResponse(
            status,
            message
        );
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, configuration.jwt.secret);

    // Call the service method with validated data
    const responseData = await profileService.updateProfile(decoded.id, req.body);

    // Send the response with appropriate status
    res.status(responseData?.status).json(responseData);
});

const profileController = {
    updateProfile
};

export default profileController;