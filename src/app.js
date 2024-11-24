'use strict';

import express from 'express';
import cors from 'cors';

import corsConfiguration, {restrictUnknownMethods} from './configuration/cors.configuration.js';
import compressionConfiguration from './configuration/compression.configuration.js';
import appRoutes from './routes.js';

const app = express();

// Security middleware
app.use(cors(corsConfiguration));
app.use(restrictUnknownMethods);
app.use(compressionConfiguration);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', appRoutes);

export default app;
