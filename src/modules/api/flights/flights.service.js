'use strict';

import FlightsModel from "./flights.model.js";
import httpStatusConstants from "../../../constant/httpStatus.constants.js";
import serviceShared from "../../../shared/service.shared.js";

import createResponse from "../../../utilities/createResponse.js";
import generateUniqueFlightNumber from "../../../utilities/generateUniqueFlightNumber.js";

const addNewFlight = async ({
    airline,
    origin,
    destination,
    departureDate,
    price,
    availableSeats,
    duration,
}) => {
    const newFlight = await FlightsModel.create({
        flightNumber: await generateUniqueFlightNumber(),
        airline,
        origin,
        destination,
        departureDate,
        price,
        availableSeats,
        duration,
    });

    if (!newFlight || !newFlight._id) {
        return createResponse(
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Failed to create the flight due to a server error.'
        );
    }

    return createResponse(httpStatusConstants.CREATED, 'Flight created successfully.', newFlight);
};

const getFlightList = async ({ origin, destination, date }) => {
    const query = {};
    const parts = [];

    if (origin) {
        query.origin = origin;
        parts.push(`from ${origin}`);
    }

    if (destination) {
        query.destination = destination;
        parts.push(`to ${destination}`);
    }

    if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        query.departureDate = {
            $gte: startOfDay,
            $lte: endOfDay,
        };
        parts.push(`on ${startOfDay.toISOString()} - ${endOfDay.toISOString()}`);
    }

    const flightList = await FlightsModel.find(query);

    if (!flightList.length) {
        return createResponse(
            httpStatusConstants.NOT_FOUND,
            'No flights found at this moment.'
        );
    }

    const message = parts.length
        ? `Flights ${parts.join(' ')} fetched successfully.`
        : 'Flights fetched successfully.';
    return createResponse(httpStatusConstants.OK, message, flightList);
};

const getFlightById = ({ id }) =>
    serviceShared.getEntityById({ id, model: FlightsModel, entityName: "Flight" });

const updateFlightById = async ({
    id,
    airline,
    origin,
    destination,
    departureDate,
    price,
    availableSeats,
    duration,
}) => {
    const existingFlight = await FlightsModel.findById(id);
    if (!existingFlight) {
        return createResponse(
            httpStatusConstants.NOT_FOUND,
            `Flight with id ${id} not found.`
        );
    }

    const updatedFlight = await FlightsModel.findByIdAndUpdate(
        id,
        {
            ...(airline && { airline }),
            ...(origin && { origin }),
            ...(destination && { destination }),
            ...(departureDate && { departureDate }),
            ...(price && { price }),
            ...(availableSeats && { availableSeats }),
            ...(duration && { duration }),
        },
        { new: true }
    );

    if (!updatedFlight) {
        return createResponse(
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update flight with id ${id} due to a server error.`
        );
    }

    return createResponse(httpStatusConstants.OK, `Flight with id ${id} updated successfully.`, updatedFlight);
};

const deleteFlightById = ({ id }) =>
    serviceShared.deleteEntityById({ id, model: FlightsModel, entityName: "Flight" });

const flightsService = {
    addNewFlight,
    getFlightList,
    getFlightById,
    updateFlightById,
    deleteFlightById,
};

export default flightsService;
