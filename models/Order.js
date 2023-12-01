const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const order_schema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
  customer_details: {
    customer_name: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true,
    },
    customer_phone: {
      type: String,
      match: /^([0]\d{1,3}[-])?\d{7,10}$/,
      required: true,
    },
    customer_address: {
      city: {
        type: String,
        trim: true,
        required: true,
      },
      street: {
        type: String,
        trim: true,
        required: true,
      },
      building: {
        type: String,
        trim: true,
        required: true,
      },
    },
  },

  total_price: {
    type: Number,
    min: 1,
  },

  products: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "products",
      },
      RTP: {
        type: Number,
        required: true,
        min: 1,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],

  order_number: {
    type: Number,
    default: function () {
      return Date.now();
    },
  },
});
order_schema.pre("save", function (next) {
  this.total_price = this.products.reduce((total, product) => {
    return total + product.RTP * product.quantity;
  }, 0);

  next();
});

module.exports = mongoose.model("orders", order_schema);
