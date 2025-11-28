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

module.exports = {
    isSignUpDataValid,

}