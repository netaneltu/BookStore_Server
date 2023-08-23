const mongoose = require('mongoose');



const Schema = mongoose.Schema;

const subcategory_schema = new Schema({

    parent_category:{
        type:String,
        required:true
    },

    category_name: {
        type:String,
        required:true
    }
})

subcategory_schema.set("strictPopulate", false);


module.exports = mongoose.model('subcategories', subcategory_schema)