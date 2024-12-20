'use strict';

import nodemailer from 'nodemailer';

import configuration from '../configuration/configuration.js';

let transporter;
let isInitialized = false; // Initialized with a default value

const connect = async () => {
    try {
        transporter = nodemailer.createTransport({
            host: configuration.email.smtp.host,
            port: configuration.email.smtp.port,
            secure: false, // Note: secure should typically be true if using port 465
            auth: {
                user: configuration.email.smtp.auth.user,
                pass: configuration.email.smtp.auth.pass,
            },
        });

        await transporter.verify();

        console.info(
            `Email service is now connected to SMTP host ${transporter.options.host} on port ${transporter.options.port}, Secure ${transporter.options.secure}`
        );

        isInitialized = true;
    } catch (error) {
        console.error(`Email service connection error: ${error.message}`);
        console.info(
            'Attempting to reconnect email service in 2 seconds...'
        );

        setTimeout(connect, 2000); // Retry connection after 2 seconds
    }
};

const sendEmail = async (emailAddress, subject, html) => {
    if (!isInitialized) {
        throw new Error(
            'Cannot send email: email transporter is not initialized.'
        );
    }

    try {
        const info = await transporter.sendMail({
            from: configuration.email.smtp.auth.user,
            to: emailAddress,
            subject,
            html,
        });

        console.info(
            `Email sent successfully to ${emailAddress}. Message ID: ${info.messageId}`
        );
    } catch (error) {
        console.error(`Email send failure: ${error.message}`);
        console.info(
            'Reconnecting email service to resolve send failure...'
        );

        await connect(); // Reconnect and then retry

        const retryInfo = await transporter.sendMail({
            from: configuration.email.smtp.auth.user,
            to: emailAddress,
            subject,
            html,
        });

        console.info(
            `Email successfully sent after reconnection. Message ID: ${retryInfo.messageId}`
        );
    }
};

const EmailService = {
    connect,
    sendEmail,
};

export default EmailService;
