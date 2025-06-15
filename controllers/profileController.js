import Product from "../models/Product.js";
import User from "../models/User.js";


export const profileGet = async (req, res, next) => {
    try {
        const userID = req.session.userID;
        const user = await User.findOne({_id:userID});
        const products = await Product.find({
            owner:userID
        }).populate('tags', 'name -_id');
        const totalProducts = await Product.find({
            owner:userID
        }).countDocuments();
        res.locals.totalProducts = totalProducts;
        res.locals.products = products;
        // console.log(user)
        res.locals.username = `${user.name} ${user.lastname_1}`
        res.render('profile');
    } catch (error) {
        next(error)
    }
}