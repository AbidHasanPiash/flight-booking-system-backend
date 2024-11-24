'use strict';

import configuration from "./configuration.js";

const corsConfiguration = {
    origin: (origin, callback) => {
        const whitelist = configuration.cors.origin; // List of allowed origins

        // Strict check: Allow only origins in the whitelist or no origin (for server-to-server requests)
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            const errorMessage = `Origin ${origin} is not allowed by CORS.`;
            console.error(errorMessage); // Log the error for debugging
            callback(new Error(errorMessage));
        }
    },
    optionsSuccessStatus: 200, // For legacy browsers that don't support 204
    methods: configuration.cors.methods.join(','), // Convert methods array to a comma-separated string
    allowedHeaders: ['Content-Type', 'Authorization'], // Only allow required headers
    credentials: true, // Allows cookies and authorization headers to be sent
    preflightContinue: false, // Stop preflight requests here (don't pass them to other middlewares)
    maxAge: 86400, // Cache preflight response for 24 hours
};

// Middleware to restrict unknown methods
export const restrictUnknownMethods = (req, res, next) => {
    const allowedMethods = configuration.cors.methods;

    if (!allowedMethods.includes(req.method)) {
        const errorMessage = `HTTP method ${req.method} is not allowed.`;
        console.error(errorMessage); // Log the error for debugging
        return res.status(405).json({
            timestamp: new Date(),
            status: 405,
            message: errorMessage,
        });
    }

    next(); // Proceed if the method is allowed
};

export default corsConfiguration;
