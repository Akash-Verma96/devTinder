const express = require('express')
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest')


requestRouter.post('/request/send/:status/:userId',userAuth, async (req,res)=>{

    try {

        const user = req.user;

        const allowedStatus = ["interested","ignore"];

        
        const fromUserId = user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        // first security check

        if(!allowedStatus.includes(status)){
            throw new Error("Status is not allowed !!!");
        }

        // second security check

        const isNotAllowed = await ConnectionRequest.findOne({
            $or : [
                {fromUserId,toUserId},
                {fromUserId : toUserId, toUserId : fromUserId}
            ]
        })

        if(isNotAllowed){
            throw new Error("Conection request already established !!");
        }

        // Third Security check

        const isUserPresent = User.findById(toUserId);

        if(!isUserPresent){
            throw new Error("User is not present !!!");
        }



        const userConnection = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        // ConnectionRequest.pre('save', function (next) {
        //     if (this.fromUserId === this.toUserId) {
        //         return next(new Error("You cannot send request to yourself!"));
        //     }
        //     next();
        //     });



        const data = await userConnection.save();

        res.json({
            message : "Connection Request Sent Succesfuly  !!!",
            data
        })
        
    } catch (error) {
        res.status(400).send('ERROR : ' + error.message);
    }
})

requestRouter.post('/request/review/:status/:userId', userAuth, async (req,res)=>{
   try {
         const loggedInUser = req.user;
        const status = req.params.status;
        const userId = req.params.userId;

        const isAllowedField = ["accepted","rejected"];


        if(!isAllowedField.includes(status)){
            throw new Error("Status is not Allowed");
        }

        const connectionUser = await ConnectionRequest.findOne({
            fromUserId : userId,
            toUserId : loggedInUser._id,
            status : "interested"
        })

        if(!connectionUser){
            throw new Error ("No user present !");
        }

        connectionUser.status = status;

        const data = await connectionUser.save()

        res.json({
            message : `${loggedInUser.firstName} accepted your Request !`,
            data : data
        })
   } catch (error) {
        res.status(400).send("ERROR : " +error);
   }




})

module.exports = requestRouter;