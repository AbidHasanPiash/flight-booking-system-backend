import emailService from "../../../service/email.service.js";

const sendBookingConfirmationEmailToUser = async (email, name, flightDetails, bookingDetails) => {
    const subject = 'Your Flight Booking Confirmation';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>We are pleased to inform you that your booking for the flight <strong>${flightDetails.flightNumber}</strong> has been successfully confirmed.</p>
        
        <p><strong>Booking Details:</strong></p>
        <ul>
            <li><strong>Flight:</strong> ${flightDetails.flightNumber}</li>
            <li><strong>Departure:</strong> ${flightDetails.departureDate}</li>
            <li><strong>Number of Seats:</strong> ${bookingDetails.numberOfSeats}</li>
            <li><strong>Total Price:</strong> $${bookingDetails.totalPrice.toFixed(2)}</li>
            <li><strong>Booking Date:</strong> ${bookingDetails.bookingDate}</li>
        </ul>

        <p>Thank you for choosing our service. If you have any questions or need assistance, please do not hesitate to contact us.</p>
        
        <p>Safe travels!</p>
        <p>Warm regards,</p>
        <p>The Flight Booking Team</p>
    `;

    await emailService.sendEmail(email, subject, htmlContent);
};

const sendUpdateBookingConfirmationEmailToUser = async (email, name, flightDetails, bookingDetails) => {
    const subject = 'Your Booking Details Have Been Updated';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>Your booking for the flight <strong>${flightDetails.flightNumber}</strong> has been updated successfully.</p>
        
        <p><strong>Updated Booking Details:</strong></p>
        <ul>
            <li><strong>Flight:</strong> ${flightDetails.flightNumber}</li>
            <li><strong>Departure:</strong> ${flightDetails.departureDate}</li>
            <li><strong>Number of Seats:</strong> ${bookingDetails.numberOfSeats}</li>
            <li><strong>Total Price:</strong> $${bookingDetails.totalPrice.toFixed(2)}</li>
            <li><strong>Status:</strong> ${bookingDetails.status}</li>
            <li><strong>Booking Date:</strong> ${bookingDetails.bookingDate}</li>
        </ul>

        <p>If you have any questions, feel free to contact us.</p>
        
        <p>Thank you!</p>
        <p>Warm regards,</p>
        <p>The Flight Booking Team</p>
    `;

    await emailService.sendEmail(email, subject, htmlContent);
};

const sendBookingCancellationEmailToUser = async (email, name, flightDetails, bookingDetails) => {
    const subject = 'Your Booking Has Been Cancelled';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>We regret to inform you that your booking for the flight <strong>${flightDetails.flightNumber}</strong> has been cancelled.</p>
        
        <p><strong>Cancelled Booking Details:</strong></p>
        <ul>
            <li><strong>Flight:</strong> ${flightDetails.flightNumber}</li>
            <li><strong>Departure:</strong> ${flightDetails.departureDate}</li>
            <li><strong>Number of Seats:</strong> ${bookingDetails.numberOfSeats}</li>
            <li><strong>Total Price:</strong> $${bookingDetails.totalPrice.toFixed(2)}</li>
            <li><strong>Status:</strong> ${bookingDetails.status}</li>
            <li><strong>Booking Date:</strong> ${bookingDetails.bookingDate}</li>
        </ul>

        <p>If you have any questions, feel free to contact us.</p>
        
        <p>We apologize for any inconvenience caused.</p>
        <p>Warm regards,</p>
        <p>The Flight Booking Team</p>
    `;

    await emailService.sendEmail(email, subject, htmlContent);
};

const sendBookingNotificationEmailToAdmin = async (email, adminName, userDetails, flightDetails, bookingDetails) => {
    const subject = 'New Flight Booking Notification';
    const htmlContent = `
        <h3>Dear ${adminName},</h3>
        
        <p>A new booking has been made for the flight <strong>${flightDetails.flightNumber}</strong>.</p>
        
        <p><strong>Booking Details:</strong></p>
        <ul>
            <li><strong>User Name:</strong> ${userDetails.name}</li>
            <li><strong>User Email:</strong> ${userDetails.email}</li>
            <li><strong>Flight:</strong> ${flightDetails.flightNumber}</li>
            <li><strong>Departure:</strong> ${flightDetails.departureDate}</li>
            <li><strong>Number of Seats:</strong> ${bookingDetails.numberOfSeats}</li>
            <li><strong>Total Price:</strong> $${bookingDetails.totalPrice.toFixed(2)}</li>
            <li><strong>Booking Date:</strong> ${bookingDetails.bookingDate}</li>
        </ul>

        <p>Please review the booking details and take any necessary actions.</p>
        
        <p>Best regards,</p>
        <p>The Flight Booking System</p>
    `;

    await emailService.sendEmail(email, subject, htmlContent);
};

const sendUpdateBookingNotificationEmailToAdmin = async (email, adminName, userDetails, flightDetails, bookingDetails) => {
    const subject = 'Booking Update Notification';
    const htmlContent = `
        <h3>Dear ${adminName},</h3>
        
        <p>The booking for the flight <strong>${flightDetails.flightNumber}</strong> has been updated.</p>
        
        <p><strong>Updated Booking Details:</strong></p>
        <ul>
            <li><strong>User Name:</strong> ${userDetails.name}</li>
            <li><strong>User Email:</strong> ${userDetails.email}</li>
            <li><strong>Flight:</strong> ${flightDetails.flightNumber}</li>
            <li><strong>Departure:</strong> ${flightDetails.departureDate}</li>
            <li><strong>Number of Seats:</strong> ${bookingDetails.numberOfSeats}</li>
            <li><strong>Total Price:</strong> $${bookingDetails.totalPrice.toFixed(2)}</li>
            <li><strong>Status:</strong> ${bookingDetails.status}</li>
            <li><strong>Booking Date:</strong> ${bookingDetails.bookingDate}</li>
        </ul>

        <p>Please review the updated details if necessary.</p>
        
        <p>Best regards,</p>
        <p>The Flight Booking System</p>
    `;

    await emailService.sendEmail(email, subject, htmlContent);
};

const sendBookingCancellationNotificationToAdmin = async (email, adminName, userDetails, flightDetails, bookingDetails) => {
    const subject = 'Booking Cancellation Notification';
    const htmlContent = `
        <h3>Dear ${adminName},</h3>
        
        <p>The booking for the flight <strong>${flightDetails.flightNumber}</strong> has been cancelled.</p>
        
        <p><strong>Cancelled Booking Details:</strong></p>
        <ul>
            <li><strong>User Name:</strong> ${userDetails.name}</li>
            <li><strong>User Email:</strong> ${userDetails.email}</li>
            <li><strong>Flight:</strong> ${flightDetails.flightNumber}</li>
            <li><strong>Departure:</strong> ${flightDetails.departureDate}</li>
            <li><strong>Number of Seats:</strong> ${bookingDetails.numberOfSeats}</li>
            <li><strong>Total Price:</strong> $${bookingDetails.totalPrice.toFixed(2)}</li>
            <li><strong>Status:</strong> ${bookingDetails.status}</li>
            <li><strong>Booking Date:</strong> ${bookingDetails.bookingDate}</li>
        </ul>

        <p>Please take note of the cancellation details if necessary.</p>
        
        <p>Best regards,</p>
        <p>The Flight Booking System</p>
    `;

    await emailService.sendEmail(email, subject, htmlContent);
};

const bookingEmailTemplate = {
    sendBookingConfirmationEmailToUser,
    sendUpdateBookingConfirmationEmailToUser,
    sendBookingCancellationEmailToUser,
    sendBookingNotificationEmailToAdmin,
    sendUpdateBookingNotificationEmailToAdmin,
    sendBookingCancellationNotificationToAdmin,
};

export default bookingEmailTemplate;
