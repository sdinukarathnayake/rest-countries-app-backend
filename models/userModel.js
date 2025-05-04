const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["user"],
        default: "user"
    },
    
    registrationDate: {
        type: Date,
        default: Date.now,
    },

    favoriteCountries: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model("User", customerSchema);