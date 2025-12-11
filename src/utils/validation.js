const validator = require('validator');

const isSignUpDataValid = (req) =>{

    const {firstName , lastName , emailId, password } = req.body;

    if(!firstName || !lastName){
        throw new Error('Fill all required field!');
    }
    else if(! validator.isEmail(emailId)){
        throw new Error('Email is not valid!');
    }
    else if( ! validator.isStrongPassword(password)){
        throw new Error("Enter strong password!");
    }
}

const isValidEdit = (req) =>{
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "age",
        "gender",
        "photoUrl",
        "skills",
        "about"
    ]

    const isAllowed  = Object.keys(req.body).every(key => allowedEditFields.includes(key));

    return isAllowed;
}

module.exports = {
    isSignUpDataValid,
    isValidEdit,
}