'use strict';

import httpStatusConstants from "../../constant/httpStatus.constants.js";

import createResponse from "../../utilities/createResponse.js";

const undefinedService = () => {
    return createResponse(
        httpStatusConstants.NOT_FOUND,
        'Invalid route!'
    );
};

export default undefinedService;
