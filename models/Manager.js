const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const manager_schema = new Schema({
  manager_name: {
    type: String,
    required: true,
  },

  manager_email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },

  manager_password: {
    type: String,
    required: true,
    match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
  },

  phone_number: {
    type: String,
    required: true,
    match: /^([0]\d{1,3}[-])?\d{7,10}$/,
  },
  tokens: [{ type: Object }],

  permission: {
      type: Number,
      default: 1
  }

});

manager_schema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.manager_password, 15);
  this.manager_password = hash;

  next();
});

module.exports = mongoose.model("managers", manager_schema);
