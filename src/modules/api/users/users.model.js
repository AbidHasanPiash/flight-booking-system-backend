'use strict';

import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: "Role must be either 'user' or 'admin'",
        },
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const UsersModel = model('Users', UserSchema);

export default UsersModel;
