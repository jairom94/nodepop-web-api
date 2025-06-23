import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

tagSchema.statics.listByField = function(field){
    const query = Tag.find()
    query.select(field)
    return query.exec()
}

const Tag = mongoose.model('Tag',tagSchema);

export default Tag;