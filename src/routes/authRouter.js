const express = require('express')
const User = require('../models/user')
const {isSignUpDataValid} = require('../utils/validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const authRouter = express.Router();

authRouter.post('/signup', async (req,res)=>{
    try {

        const {firstName, lastName,emailId,password} = req.body;
        // validating data
        

        isSignUpDataValid(req);
        // Encrypting password
        const hashPassword = await bcrypt.hash(password,10);


        const user = new User({
            firstName,
            lastName,
            emailId,
            password : hashPassword,
        });

        
        // to save data in mongodb
        await user.save();
        res.send("Data save to database...")
    } catch (error) {
        res.status(404).send("ERROR : " + error.message);
    }
})

authRouter.post('/login',async (req,res)=>{
    try {
        const {emailId,password} = req.body;

        const user = await User.findOne({emailId : emailId});

        if(!user){
            throw new Error("Invalid credential!");
        }

        const isValidPassword = await user.isValidPassword(password);

        if(isValidPassword){
            // createing Token

            const token = await user.getJWT();

            res.cookie("token", token);
            res.send("Login Successfull..");
        }
        else throw new Error("Invalid credential!");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

module.exports = authRouter;