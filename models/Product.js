const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const product_schema = new Schema({
  product_name: {
    type: String,
    required: true,
  },

  product_description: {
    type: String,
  },

  product_price: {
    type: Number,
    required: true,
    min: 1,
  },

  product_image: [
    {
      type: String,
    },
  ],
  categories: [
    {
      type: Object,
    },
  ],
});

product_schema.set("strictPopulate", false);

module.exports = mongoose.model("products", product_schema);
