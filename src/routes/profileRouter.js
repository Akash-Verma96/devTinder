const express = require('express')
const {userAuth} = require('../middlewares/auth')
const User = require('../models/user')
const {isValidEdit} = require('../utils/validation')
const validator = require('validator')
const bcrypt = require('bcrypt')

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req,res)=>{
    try{
    
       const user = req.user;

        res.send(user);
    }
    catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

profileRouter.patch('/profile/edit', userAuth , async (req,res)=>{
    try {
        
        const isEditAllowed = isValidEdit(req);
        
        if(!isEditAllowed){
            throw new Error("Invalid edit request !!!");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);

        const data = await loggedInUser.save();

        // if(!data){
        //     throw new Error("Invalid Edit !!");
        // }

        res.json({
            message:`${loggedInUser.firstName} your profile updated Successefuly !`,
            data : data
        })
    } 
    catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
    
})

profileRouter.patch('/profile/password', userAuth , async (req,res)=>{
    try {
        const { password } = req.body;

        if( !validator.isStrongPassword(password)){
            throw new Error("Enter Strong password !!!");
        }

        const user = req.user;

        const isValidPassword = await user.isValidPassword(password);

        if(isValidPassword){
            throw new Error("Password should be change  !!!");
        }

        const hashPassword = await bcrypt.hash(password,10);

        user.password = hashPassword;

        await user.save();

        

        res.send(user);
    
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }


})

module.exports = profileRouter;