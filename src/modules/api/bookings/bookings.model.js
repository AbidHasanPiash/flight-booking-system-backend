'use strict';

import {model, Schema} from 'mongoose';

const BookingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    flightId: { type: Schema.Types.ObjectId, ref: 'Flights', required: true },
    numberOfSeats: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    bookingDate: { type: Date, default: Date.now },
});

const BookingsModel = model('Bookings', BookingSchema);

export default BookingsModel;
