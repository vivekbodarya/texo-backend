const mongoose = require('mongoose')
const products = mongoose.Schema({
    assets: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "assets",
        required: true
    },
    a_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    product_name: {
        type: String,
        require: true
    },
    product_taka: {
        type: Number,
    },
    product_meter: {
        type: Number,
    },
    product_machine: {
        type: Number,
    },
    product_data: [
        {
            _id: mongoose.Types.ObjectId,
            date: {
                type: String,
            },
            production_taka: {
                type: Number,
            },
            production_meter: {
                type: Number,
            },
            billno: {
                type: String,
            },
            sale_taka: {
                type: Number,
            },
            sale_meter: {
                type: Number,
            },
            return_meter: {
                type: Number,
            },
            return_taka: {
                type: Number,
            },
            party_name: {
                type: String,
            },
            stock_taka: {
                type: Number,
            },
            stock_meter: {
                type: Number,
            }
        }
    ],
    total_production_taka: {
        type: Number,
    },
    total_production_meter: {
        type: Number,
    },

    total_sale_taka: {
        type: Number,
    },
    total_sale_meter: {
        type: Number,
    },

    total_stock_taka: {
        type: Number,
    },
    total_stock_meter: {
        type: Number,
    },

    last_editing: {
        type: String,
    },
    last_editing_date: {
        type: String,
    },
    time: {
        type: String,
        default: Date().toLocaleString()
    }

})

module.exports = mongoose.model('power_looms_products', products)