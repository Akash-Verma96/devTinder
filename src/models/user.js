const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// creating a instance of mongoose Schema
const userschema = new mongoose.Schema({
    firstName : {
        type : String,
        required: true,
        minLength:3,
        maxLength : 50,
    },
    lastName : {
        type : String,
        minLength : 3,
        maxLength : 50,
    },
    emailId : {
        type : String,
        required:true,
        lowercase : true,
        unique:true,
        trim:true,

        validate(value){
            const isValidEmail = validator.isEmail(value);

            if(!isValidEmail){
                throw new Error('Email is not valid...');
            }
        }
    },
    password : {
        type : String,
        required:true,
    },
    age : {
        type : Number,
        min:18,
    },
    gender : {
        type : String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender is not valid...");
            }
        }
    },
    photoUrl : {
        type:String,
        default:"https://tse2.mm.bing.net/th/id/OIP.j7sZ8mcnlXSXVD_mNzlFvQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",

        validate(value){
            const isValidUrl = validator.isURL(value);

            if(!isValidUrl) throw new Error('Not valid url...');
        }
        
    },
    skills : {
        type : [String],
    },
    about : {
        type : String,
        default : "This is default about...",
    }

},{
    timestamps : true,
})

userschema.methods.getJWT = async function (){
    const user = this;

    const token =  await jwt.sign({_id : user._id}, "DevTinder$321",{expiresIn:"7d"});

    return token;
}

userschema.methods.isValidPassword = async function(password){
    const user = this;
    const isValid = await bcrypt.compare(password , user.password);

    return isValid;
}

module.exports = mongoose.model("User", userschema)