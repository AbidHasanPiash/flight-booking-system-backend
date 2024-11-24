'use strict';

import mongoose from 'mongoose';

import configuration from '../configuration/configuration.js';
import adminService from "../modules/api/admin/admin.service.js";

const connect = async () => {
    // Set up event listeners for the MongoDB connection
    mongoose.connection.on('error', (error) =>
        console.error(`Database connection error: ${error.message}`)
    );

    // mongoose.connection.on('connected', () =>
    //     console.info('Database connection established.')
    // );

    // mongoose.connection.on('connecting', () =>
    //     console.info('Attempting to connect to the database...')
    // );

    mongoose.connection.on('disconnecting', () =>
        console.info('Database is disconnecting...')
    );

    mongoose.connection.on('disconnected', async () => {
        console.warn('Database disconnected! Attempting to reconnect...');

        try {
            await mongoose.connect(configuration.mongoose.url);
            console.info('Database reconnected successfully.');
        } catch (error) {
            console.error(
                `Database reconnection failed: ${error.message}`
            );
        }
    });

    mongoose.connection.on('uninitialized', () =>
        console.warn('Database connection is uninitialized.')
    );

    mongoose.connection.on('reconnected', () =>
        console.info('Database has successfully reconnected.')
    );

    // Attempt to connect to the database
    try {
        await mongoose.connect(configuration.mongoose.url);
        const dbName = mongoose.connection.db.databaseName;

        console.info(`Database connected successfully to '${dbName}'.`);

        // Create default admin user
        await adminService.createDefaultAdmin();
    } catch (error) {
        console.error(
            `Initial database connection attempt failed: ${error.message}`
        );

        throw error; // Re-throwing is necessary for the caller to handle it
    }
};

const disconnect = async () => {
    try {
        console.info('Database connection disconnecting...');

        await mongoose.disconnect();

        console.info('Database connection disconnected successfully.');
    } catch (error) {
        console.error(`Database disconnection error: ${error.message}`);

        throw error; // Re-throwing is necessary for the caller to handle it
    }
};

const DatabaseService = {
    connect,
    disconnect,
};

export default DatabaseService;
