'use strict';

import express from 'express';

import authController from "./auth/auth.controller.js";
import adminController from "./admin/admin.controller.js";
import flightsController from "./flights/flights.controller.js";
import bookingsController from "./bookings/bookings.controller.js";

import methodNotSupported from "../../shared/methodNotSupported.js";
import authenticationMiddleware from "../../middleware/authentication.middleware.js";

const router = express.Router();

router
    .route('/registration')
    .post(authController.registration)
    .all(methodNotSupported);

router
    .route('/login')
    .post(authController.login)
    .all(methodNotSupported);

router
    .route('/admin/login')
    .post(adminController.login)
    .all(methodNotSupported);

router
    .route('/flights')
    .post(authenticationMiddleware, flightsController.addNewFlight)
    .get(flightsController.getFlightList)
    .all(methodNotSupported);

router
    .route('/flights/:id')
    .get(flightsController.getFlightById)
    .patch(authenticationMiddleware, flightsController.updateFlightById)
    .delete(authenticationMiddleware, flightsController.deleteFlightById)
    .all(methodNotSupported);

router
    .route('/bookings')
    .post(authenticationMiddleware, bookingsController.addNewBooking)
    .get(bookingsController.getBookingList)
    .all(methodNotSupported);

router
    .route('/bookings/:id')
    .get(bookingsController.getBookingById)
    .patch(authenticationMiddleware, bookingsController.updateBookingById)
    .delete(authenticationMiddleware, bookingsController.deleteBookingById)
    .all(methodNotSupported);

router
    .route('/bookings/user/:id')
    .get(bookingsController.getBookingByUserId)
    .all(methodNotSupported);

export default router;
