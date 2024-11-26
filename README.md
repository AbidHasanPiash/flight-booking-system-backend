
# Flight Booking System Backend

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
  - [Example Configuration](#example-configuration)
- [API Endpoints](#api-endpoints)
- [License](#license)
- [Author](#author)

---

## Introduction

This is the backend server for the **Flight Booking System**, built with:
- **Node.js**
- **Express.js**
- **MongoDB**
- **Zod for Validation**
- **JWT Authentication**

It provides RESTful APIs for flight management, booking management, and user authentication.

---

## Features
- **User Authentication**: Registration and Login.
- **Flight Management**: CRUD operations for flights.
- **Booking Management**: Book flights and manage bookings.
- **Secure API**: JWT-based authentication and role-based access control.

---

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v20.x or higher)
- **npm** (Node Package Manager)
- **MongoDB** (local or cloud instance)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AbidHasanPiash/flight-booking-system-backend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd flight-booking-system-backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

---

## Running the Application

### Development Mode
1. Create a `.env.development` file based on the provided `env.example` file (see [Environment Variables](#environment-variables)).
2. Start the development server:
   ```bash
   npm run dev
   ```

### Production Mode
1. Create a `.env.production` file based on the provided `env.example` file.
2. Start the server:
   ```bash
   npm start
   ```

The server will run on the port specified in the `PORT` environment variable (default: `5000`).

---

## Environment Variables

To configure the environment, create an `.env.development` file in the project root. You can use the `env.example` file as a reference.

### Example Configuration

```plaintext
####################################################
# Application Environment
NODE_ENV=development

####################################################
# Server Configuration
PORT=5000
VERSION=v1

####################################################
# Database Configuration
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>?retryWrites=true&w=majority

####################################################
# JWT Configuration
JWT_SECRET=your-very-secure-secret

####################################################
# CORS Configuration
CORS_ORIGIN=http://localhost:5000,http://localhost:3000
CORS_METHODS=OPTIONS,GET,PATCH,POST,DELETE

####################################################
# Email Service Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-email-password
EMAIL_FROM=your-email@example.com

####################################################
# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminpassword
```

Replace placeholder values (e.g., `<username>`, `<password>`) with your specific configuration.

To simplify the process, an `env.example` file is included in the project. Copy and rename it:
```bash
cp env.example .env.development
```

---

## API Endpoints

### Authentication
- **POST** `/registration`: Register a new user.
- **POST** `/login`: Log in and receive a JWT.

### Flight Management
- **POST** `/flights`: Add a new flight (admin only).
- **GET** `/flights`: Retrieve all flights.
- **GET** `/flights/:id`: Retrieve flight details by ID.
- **PATCH** `/flights/:id`: Update flight details by ID (admin only).
- **DELETE** `/flights/:id`: Delete a flight by ID (admin only).

### Booking Management
- **POST** `/bookings`: Create a new booking.
- **GET** `/bookings`: Retrieve all bookings.
- **GET** `/bookings/:id`: Retrieve booking details by ID.
- **GET** `/bookings/user/:id`: Retrieve bookings by user ID.
- **PATCH** `/bookings/:id`: Update booking details by ID.
- **DELETE** `/bookings/:id`: Delete a booking by ID.

### Profile Management
- **PATCH** `/profile`: Update user profile.

---

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

## Author

**Abid Hasan**  
- [Portfolio](https://abidhasan.vercel.app/)
- [LinkedIn](https://www.linkedin.com/in/abidhasanpiash/)
- [GitHub](https://github.com/AbidHasanPiash)

Feel free to reach out for any queries or collaboration opportunities!
