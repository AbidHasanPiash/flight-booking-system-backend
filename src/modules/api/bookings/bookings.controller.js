'use strict';

import bookingsService from './bookings.service.js';
import bookingsSchema from "./bookings.schema.js";

import asyncErrorHandlerService from "../../../utilities/asyncErrorHandler.js";
import handleRequest from "../../../shared/handleRequest.js";

const addNewBooking = handleRequest(
    bookingsSchema.addNewBooking,
    bookingsService.addNewBooking,
    'body'
);

const getBookingList = handleRequest(
    bookingsSchema.getBookingByQuery,
    bookingsService.getBookingList,
    'query'
);

const getBookingById = handleRequest(
    bookingsSchema.bookingId,
    bookingsService.getBookingById,
    'params'
);

const getBookingByUserId = handleRequest(
    bookingsSchema.bookingId,
    bookingsService.getBookingByUserId,
    'params'
);

const updateBookingById = asyncErrorHandlerService(async (req, res) => {
    // Validate the request params and body
    const validatedData = bookingsSchema.updateBookingById.parse({
        id: req.params.id,
        ...req.body,
    });

    // Call the service to update the booking
    const updatedBooking = await bookingsService.updateBookingById(validatedData);

    // Send the response
    res.status(updatedBooking?.status).json(updatedBooking);
});

const deleteBookingById = handleRequest(
    bookingsSchema.bookingId,
    bookingsService.deleteBookingById,
    'params'
);

const bookingsController = {
    addNewBooking,
    getBookingList,
    getBookingById,
    getBookingByUserId,
    updateBookingById,
    deleteBookingById,
};

export default bookingsController;
