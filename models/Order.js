const mongoose = require('mongoose');



const Schema = mongoose.Schema;

const order_schema = new Schema({


    user: {
            type:mongoose.Types.ObjectId,
            ref:'users',
            required:true
    },

    total_price: {
        type:Number,
        required:true,
        min:1
    },


    payment_details: {

        terminal_number :  {
            type:String,
            required:true,
            match:/^[0-9]+$/
        },

        transaction_number : {
            type:String,
            required:true,
            match:/^[0-9]+$/,
            unique:true
        },

        transaction_date: {
            type:Date,
            default:Date.now()
        },

        last_digits: {
            type:String,
            required:true,
            match:/^[0-9]+${,4}/
        }

    },


    products: [

        {
            product: {
                type:mongoose.Types.ObjectId,
                ref:'products'
            },
            RTP: {
                type:Number,
                required:true,
                min:1
            },
            quantity : {
                type:Number,
                required:true,
                min:1
            }
        }
    ]




    

})



module.exports = mongoose.model('orders', order_schema)