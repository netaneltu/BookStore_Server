const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const user_schema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },

  password: {
    type: String,
    required: true,
    match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
  },

  phone_number: {
    type: String,
    required: true,
    match: /^([0]\d{1,3}[-])?\d{7,10}$/,
  },

  user_address: {
    city: {
      type: String,
    
    },
    street: {
      type: String,
     
    },

    building: {
      type: String,
      
    },

    appartment: {
      type: String,
    },
  },
  cart: {
    type: mongoose.Types.ObjectId,
    ref: "carts",
  },

  user_orders: [
    {
      order: {
        type: mongoose.Types.ObjectId,
        ref: "orders",
        
      },
    },
  ],
});

user_schema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 15);
  this.password = hash;

  next();
});

module.exports = mongoose.model("users", user_schema);
