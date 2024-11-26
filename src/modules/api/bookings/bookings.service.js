'use strict';

import BookingsModel from "./bookings.model.js";
import httpStatusConstants from "../../../constant/httpStatus.constants.js";
import FlightsModel from "../flights/flights.model.js";
import UsersModel from "../users/users.model.js";
import serviceShared from "../../../shared/service.shared.js";
import bookingEmailTemplate from "./bookings.emailTemplate.js";
import configuration from "../../../configuration/configuration.js";

import createResponse from "../../../utilities/createResponse.js";

const addNewBooking = async ({ userId, flightId, numberOfSeats, totalPrice, status = 'confirmed' }) => {
    const flight = await FlightsModel.findById(flightId);
    if (!flight) {
        return createResponse(httpStatusConstants.NOT_FOUND, 'Flight not found.');
    }

    const user = await UsersModel.findById(userId);
    if (!user) {
        return createResponse(httpStatusConstants.NOT_FOUND, 'User not found.');
    }

    if (flight.availableSeats < numberOfSeats) {
        return createResponse(
            httpStatusConstants.BAD_REQUEST,
            `Not enough seats available. Only ${flight.availableSeats} seats are available.`
        );
    }

    flight.availableSeats -= numberOfSeats;
    await flight.save();

    const newBooking = await BookingsModel.create({
        userId,
        flightId,
        numberOfSeats,
        totalPrice,
        status,
        bookingDate: new Date(),
    });

    if (!newBooking || !newBooking._id) {
        return createResponse(
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Failed to create the booking due to a server error.'
        );
    }

    try {
        // Send email to user
        await bookingEmailTemplate.sendBookingConfirmationEmailToUser(
            user.email,
            user.name || 'User',
            { flightNumber: flight.flightNumber, departureDate: flight.departureDate },
            {
                numberOfSeats,
                totalPrice,
                bookingDate: new Date().toLocaleDateString(),
            }
        );

        // Send email to admin
        await bookingEmailTemplate.sendBookingNotificationEmailToAdmin(
            configuration.admin.email,
            'Admin',
            { name: user.name, email: user.email },
            { flightNumber: flight.flightNumber, departureDate: flight.departureDate },
            {
                numberOfSeats,
                totalPrice,
                bookingDate: new Date().toLocaleDateString(),
            }
        );
    } catch (error) {
        console.error(`Failed to send booking confirmation email: ${error.message}`);
    }

    return createResponse(httpStatusConstants.CREATED, 'Booking created successfully.', newBooking);
};

const getBookingList = async ({ origin, destination, date }) => {
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

    const bookingList = await BookingsModel.find(query);

    if (!bookingList.length) {
        return createResponse(httpStatusConstants.NOT_FOUND, 'No bookings found at this moment.');
    }

    const message = parts.length
        ? `Bookings ${parts.join(' ')} fetched successfully.`
        : 'Bookings fetched successfully.';
    return createResponse(httpStatusConstants.OK, message, bookingList);
};

const getBookingById = (data) =>
    serviceShared.getEntityById({ ...data, model: BookingsModel, entityName: "Booking" });

const getBookingByUserId = async ({ id }) => {
    const user = await UsersModel.findById(id);
    if (!user) {
        return createResponse(httpStatusConstants.NOT_FOUND, 'User not found.');
    }

    const bookingData = await BookingsModel.find({ userId: id });
    if (!bookingData.length) {
        return createResponse(httpStatusConstants.NOT_FOUND, `No bookings found for user with id ${id}.`);
    }

    // Fetch flight details for each booking
    const updatedBookingData = await Promise.all(
        bookingData.map(async (booking) => {
            const flightDetails = await FlightsModel.findById(booking.flightId);
            if (!flightDetails) {
                console.warn(`Flight not found for flightId: ${booking.flightId}`);
                return { ...booking.toObject(), flightDetails: null };
            }
            return { ...booking.toObject(), flightDetails: flightDetails.toObject() };
        })
    );

    return createResponse(
        httpStatusConstants.OK,
        `Booking with user id ${id} fetched successfully.`,
        updatedBookingData
    );
};

const updateBookingById = async (data) => {
    const { id, ...updateFields } = data;

    const existingBooking = await BookingsModel.findById(id).populate('userId').populate('flightId');
    if (!existingBooking) {
        return createResponse(httpStatusConstants.NOT_FOUND, `Booking with id ${id} not found.`);
    }

    const updatedBooking = await BookingsModel.findByIdAndUpdate(id, updateFields, { new: true }).populate('userId').populate('flightId');
    if (!updatedBooking) {
        return createResponse(
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update booking with id ${id} due to a server error.`
        );
    }

    try {
        const user = updatedBooking.userId;
        const flight = updatedBooking.flightId;

        const bookingDetails = {
            flightNumber: flight.flightNumber, // Customize based on your flight schema
            numberOfSeats: updatedBooking.numberOfSeats,
            totalPrice: updatedBooking.totalPrice,
            bookingDate: updatedBooking.bookingDate,
            status: updatedBooking.status,
        };

        // Send email to user
        await bookingEmailTemplate.sendUpdateBookingConfirmationEmailToUser(
            user.email,
            user.name || 'User',
            { title: flight.flightNumber, departureDate: flight.departureDate },
            bookingDetails
        );

        // Send email to admin
        await bookingEmailTemplate.sendUpdateBookingNotificationEmailToAdmin(
            configuration.admin.email,
            'Admin',
            { name: user.name, email: user.email },
            { title: flight.flightNumber, departureDate: flight.departureDate },
            bookingDetails
        );
    } catch (error) {
        console.error(`Failed to send booking update email: ${error.message}`);
    }

    return createResponse(httpStatusConstants.OK, `Booking with id ${id} updated successfully.`, updatedBooking);
};

const deleteBookingById = async ({ id }) => {
    const existingBooking = await BookingsModel.findById(id).populate('userId').populate('flightId');
    if (!existingBooking) {
        return createResponse(
            httpStatusConstants.NOT_FOUND,
            `Booking with id ${id} not found.`
        );
    }

    const deletedBooking = await BookingsModel.findByIdAndDelete(id);

    if (!deletedBooking) {
        return createResponse(
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to delete booking with id ${id} due to a server error.`
        );
    }

    try {
        const user = existingBooking.userId;
        const flight = existingBooking.flightId;

        const bookingDetails = {
            flightNumber: flight.flightNumber, // Customize based on your flight schema
            numberOfSeats: existingBooking.numberOfSeats,
            totalPrice: existingBooking.totalPrice,
            bookingDate: existingBooking.bookingDate,
            status: existingBooking.status,
        };

        // Send email to user
        await bookingEmailTemplate.sendBookingCancellationEmailToUser(
            user.email,
            user.name || 'User',
            { title: flight.flightNumber, departureDate: flight.departureDate },
            bookingDetails
        );

        // Send email to admin
        await bookingEmailTemplate.sendBookingCancellationNotificationToAdmin(
            configuration.admin.email,
            'Admin',
            { name: user.name, email: user.email },
            { title: flight.flightNumber, departureDate: flight.departureDate },
            bookingDetails
        );
    } catch (error) {
        console.error(`Failed to send booking cancellation email: ${error.message}`);
    }

    return createResponse(
        httpStatusConstants.OK,
        `Booking with id ${id} deleted successfully.`,
        deletedBooking
    );
};

const bookingsService = {
    addNewBooking,
    getBookingList,
    getBookingById,
    getBookingByUserId,
    updateBookingById,
    deleteBookingById,
};

export default bookingsService;
