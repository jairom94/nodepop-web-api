import mongoose, { Types } from "mongoose";
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
    const filters = { ...args?.['filters'] || {} };    
    // console.log(filters);
    
    const query = Product.find(filters);
    // const query = Product.find(args?.['filter'])
    query.limit(args?.['limit'])
    query.skip(args?.['skip'])
    query.sort(args?.['sort'])
    query.select(args?.['fields'])
    query.select('-__v')
    query.populate({ path: 'tags', select: 'name _id' })    
    return query.exec()            
}

productSchema.statics.priceRange = function(userId) {
    return Product.aggregate([
            {
                $match: {
                    owner: Types.ObjectId.createFromHexString(userId)
                }
            },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
            }
        ])
}

productSchema.statics.isObjectId = function(value){
  return Types.ObjectId.isValid(value) &&
  Types.ObjectId.createFromHexString(value).toString() === value
}

const Product = mongoose.model('Product',productSchema);

export default Product;

