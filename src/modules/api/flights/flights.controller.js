'use strict';

import flightsService from './flights.service.js';
import flightsSchema from "./flights.schema.js";

import asyncErrorHandlerService from "../../../utilities/asyncErrorHandler.js";
import handleRequest from "../../../shared/handleRequest.js";

const addNewFlight = handleRequest(
    flightsSchema.addNewFlight,
    flightsService.addNewFlight,
    'body'
);

const getFlightList = handleRequest(
    flightsSchema.getFlightByQuery,
    flightsService.getFlightList,
    'query'
);

const getFlightById = handleRequest(
    flightsSchema.flightId,
    flightsService.getFlightById,
    'params'
);

const updateFlightById = asyncErrorHandlerService(async (req, res) => {
    // Validate the request params and body
    const validatedData = flightsSchema.updateFlightById.parse({
        id: req.params.id,
        ...req.body,
    });

    // Call the service to update the flight
    const updatedFlight = await flightsService.updateFlightById(validatedData);

    // Send the response
    res.status(updatedFlight?.status).json(updatedFlight);
});

const deleteFlightById = handleRequest(
    flightsSchema.flightId,
    flightsService.deleteFlightById,
    'params'
);

const flightsController = {
    addNewFlight,
    getFlightList,
    getFlightById,
    updateFlightById,
    deleteFlightById,
};

export default flightsController;
