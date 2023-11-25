const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
    },
    orderItems: [

        {

            name: {

                type: String,

                required: true

            },

            quantity: {

                type: Number,

                required: true,
                default : 1
            },

            image: {

                type: String,

                required: true

            },

            price: {

                type: Number,

                required: true

            },

            product: {

                type: mongoose.Schema.Types.ObjectId,

                required: false,

                ref: 'Product'

            },
            storeId: {
                type: mongoose.Schema.Types.ObjectId,
                required: false,
                ref: 'Store'
            },
            storeName: {
                type: String,
                required: true
            },
            

        }

    ],

    paymentType: {
        type: String,
        required: true,
        default: 'Online'
    },

    paidAt: {
        type: Date
    },

    totalPrice: {

        type: Number,

        required: true,

        default: 0.0

    },

    orderStatus: {

        type: String,

        required: true,

        default: 'Processing'

    },
    createdAt: {

        type: Date,

        default: Date.now

    }

})

module.exports = mongoose.model('Order', orderSchema)