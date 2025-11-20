const adminAuth = (req,res,next)=>{

    console.log("Authantication is Checking...");

    const token = "xyz";

    const isAdminAuthorized = token === 'xyz';

    if(!isAdminAuthorized){
        res.status(404).send("Unauthorized Access!!!");
    }
    else next();
}
const userAuth = (req,res,next)=>{

    console.log("Authantication is Checking...");

    const token = "xyzaksa";

    const isAdminAuthorized = token === 'xyz';

    if(!isAdminAuthorized){
        res.status(404).send("Unauthorized Access!!!");
    }
    else next();
}

module.exports = {
    adminAuth,
    userAuth,
}