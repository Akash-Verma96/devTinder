const jwt = require('jsonwebtoken')
const User = require('../models/user')


const userAuth = async (req,res,next)=>{
    try{
        const { token } = req.cookies;
        if(!token){
            return res.status(401).send("Please Login !!");
        }

        const decodedData = jwt.verify(token,process.env.ZWT_SECRET);

        const {_id} = decodedData;

        const user = await User.findById({_id: _id});

        if(!user){
            return res.status(401).send("User not found !!");
        }

        req.user = user;

        next();

    }
    catch(err){
        return res.status(400).send("ERROR : " + err.message);
    }
}

module.exports = {
    userAuth,
}