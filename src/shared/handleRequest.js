import asyncErrorHandlerService from "../utilities/asyncErrorHandler.js";

const handleRequest = (schema, serviceMethod, input = 'body') =>
    asyncErrorHandlerService(async (req, res) => {
        // Validate the request data (body, query, or params)
        const validatedData = schema.parse(req[input]);

        // Call the service method with validated data
        const responseData = await serviceMethod(validatedData);

        // Send the response with appropriate status
        res.status(responseData?.status).json(responseData);
    });

export default handleRequest;