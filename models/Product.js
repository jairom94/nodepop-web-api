import mongoose from "mongoose";
// import { index } from "../controllers/homeController";


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        index:true
    },
    price:{
        type:Number,
        required:true,
        index:true
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

productSchema.statics.list = function ({...args}) {
    const query = Product.find(args?.['filter'])
    query.limit(args?.['limit'])
    query.skip(args?.['skip'])
    query.sort(args?.['sort'])
    query.select(args?.['fields'])
    return query.exec()            
}

const Product = mongoose.model('Product',productSchema);

export default Product;