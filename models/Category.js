const mongoose = require('mongoose');
const SubCategory  = require('./SubCategory');



const Schema = mongoose.Schema;

const category_schema = new Schema({

    category_name: {
        type:String,
        required:true
    },
    category_image: {
        type:String,
        required:false
    },
    subcategories:[
        
           {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subcategories",
            
       
    }
    ],
    top_products:[
        
        {
         type: mongoose.Schema.Types.ObjectId,
         ref: "products",
         
    
 }
 ]
})
category_schema.set("strictPopulate", false);



module.exports = mongoose.model('categories', category_schema)