const mongoose = require("mongoose");

const rentSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Store'
    },
    amount: {
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
        required: [true, "Please enter payment type"],
        default: "Cash",

    },
    note: {
        type: String,
        required: false,
    },
    paidAt: {
        type: Date,
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    },

});

module.exports = mongoose.model("Rent", rentSchema);


