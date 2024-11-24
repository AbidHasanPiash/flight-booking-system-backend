'use strict';

import { model, Schema } from 'mongoose';

const AdminSchema = new Schema({
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
            values: ['super_admin', 'admin'],
            message: "Role must be either 'super_admin' or 'admin'",
        },
        default: 'admin',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const AdminsModel = model('Admins', AdminSchema);

export default AdminsModel;
