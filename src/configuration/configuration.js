'use strict';

import dotenv from 'dotenv';
import { z } from 'zod';

import environment from '../constant/envTypes.constants.js';

dotenv.config({
    path: `.env.${process.env.NODE_ENV || environment.DEVELOPMENT}`,
});

// Helper functions
const getInt = (envVar, defaultValue) => {
    const parsed = parseInt(envVar, 10);
    return isNaN(parsed) ? defaultValue : parsed;
};

const getEnvVar = (envVar, defaultValue) => {
    if (envVar === undefined || envVar === null || envVar === '') {
        return defaultValue;
    }
    return envVar;
};

// Base MongoDB URL which might be appended with '-test' for test environment
const mongoDbUrl =
    getEnvVar(process.env.MONGODB_URL, '') +
    (process.env.NODE_ENV === environment.TEST ? '-test' : '');

// Zod schema for environment variables
const envVarsSchema = z.object({
    NODE_ENV: z.enum([
        environment.PRODUCTION,
        environment.STAGING,
        environment.DEVELOPMENT,
        environment.TEST,
    ]).describe('The application environment.'),
    PORT: z
        .string()
        .refine((val) => !isNaN(parseInt(val)), 'PORT must be a number')
        .describe('The server port.'),

    MONGODB_URL: z.string().url().describe('MongoDB URL.'),

    JWT_SECRET: z.string().describe('JWT secret key.'),

    CORS_ORIGIN: z
        .string()
        .refine((val) => val.split(',').every((url) => /^https?:\/\/.+/.test(url)), 'CORS_ORIGIN must be a valid URI or comma-separated URIs.')
        .describe('CORS origin.'),
    CORS_METHODS: z.string().describe('CORS methods.'),

    SMTP_HOST: z.string().describe('Server that will send the emails.'),
    SMTP_PORT: z
        .string()
        .refine((val) => !isNaN(parseInt(val)), 'SMTP_PORT must be a number')
        .describe('Port to connect to the email server.'),
    SMTP_USERNAME: z.string().describe('Username for email server.'),
    SMTP_PASSWORD: z.string().describe('Password for email server.'),
    SMTP_MAX_CONNECTION_RETRY_ATTEMPTS: z
        .string()
        .refine((val) => !isNaN(parseInt(val)), 'SMTP_MAX_CONNECTION_RETRY_ATTEMPTS must be a number')
        .describe('Maximum number of connection retry attempts.'),
    EMAIL_FROM: z.string().email().describe('The "from" field in the emails sent by the app.'),

    ADMIN_EMAIL: z.string().email().describe('Admin email address.'),
    ADMIN_PASSWORD: z.string().describe('Admin password.'),
});

// Validate and parse environment variables
const parsedEnv = envVarsSchema.safeParse(process.env);

if (!parsedEnv.success) {
    const errorMessages = parsedEnv.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
    throw new Error(`Config validation error: ${errorMessages}`);
}

const envVars = parsedEnv.data;

// Configuration object
const configuration = {
    env: getEnvVar(envVars.NODE_ENV, environment.DEVELOPMENT),
    port: getInt(getEnvVar(envVars.PORT, 3000), 3000),
    mongoose: {
        url: mongoDbUrl,
    },
    jwt: {
        secret: getEnvVar(envVars.JWT_SECRET, ''),
    },
    cors: {
        origin: envVars.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
        methods: envVars.CORS_METHODS.split(',').map((method) => method.trim()),
    },
    email: {
        smtp: {
            host: getEnvVar(envVars.SMTP_HOST, ''),
            port: getInt(envVars.SMTP_PORT, 587),
            auth: {
                user: getEnvVar(envVars.SMTP_USERNAME, ''),
                pass: getEnvVar(envVars.SMTP_PASSWORD, ''),
            },
            maxConnectionAttempts: getInt(envVars.SMTP_MAX_CONNECTION_RETRY_ATTEMPTS, 5),
        },
        from: getEnvVar(envVars.EMAIL_FROM, ''),
    },
    admin: {
        email: getEnvVar(envVars.ADMIN_EMAIL, ''),
        password: getEnvVar(envVars.ADMIN_PASSWORD, ''),
    },
};

export default configuration;
