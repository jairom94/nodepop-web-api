import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        index:true
    },
    image:{
        type:String,
        required:true
    },
    tags:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tag'
    }]
    
})

const Product = mongoose.model('Product',productSchema);

export default Product;