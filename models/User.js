import mongose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongose.Schema({
    name:{
        type:String,
        maxlength:50,
        required:true
    },
    lastname_1:{
        type:String,
        maxlength:50,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

userSchema.statics.hashPassword = (clearPassword) => {
    return bcrypt.hash(clearPassword,7);
}

userSchema.methods.comparePassword = function (clearPassword) {
    return bcrypt.compare(clearPassword,this.password)
}

const User = mongose.model('User',userSchema);

export default User;