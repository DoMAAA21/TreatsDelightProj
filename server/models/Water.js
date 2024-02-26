const mongoose = require("mongoose");

const waterSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Store'
    },
    total: {
        type: Number,
        required: [true, "Please enter total"],
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "Please enter price"],
        default: 0,

    },
    additionals: {
        type: Number,
        default: 0,
    },
    consumed: {
        type: Number,
        required: [true, "Please enter amount"],
        default: 0,

    },
    type: {
        type: String,
        required: [true, "Please enter type"],
        default: "topay",

    },
    paymentType: {
        type: String,
        required: false,
        default: "Cash",

    },
    note: {
        type: String,
        required: false,
    },
    paidAt: {
        type: Date,
        default: null,
        allowNull: true,
    },
    issuedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model("Water", waterSchema);

