const express = require('express')
const userRouter = express.Router();

const {userAuth} = require('../middlewares/auth')
const connectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

const USER_SAFE_DATA = "firstName lastName age gender photoUrl skills about"

userRouter.get('/user/requests/recieved',userAuth, async (req , res)=>{

  try {
        const loggedInUser = req.user;

        const data = await connectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId", USER_SAFE_DATA)
        // }).populate("fromUserId", ["firstName", "lastName"])

        res.json({
            message : "Data fetched Successfully !",
            data : data
        })
  } catch (error) {
    res.status(400).send("ERROR : " + error);
  }


})

userRouter.get('/user/connections', userAuth, async (req, res)=>{

  try {

    const loggedInUser = req.user;

    const connectionRequests = await connectionRequest.find({
      $or : [
        {fromUserId : loggedInUser._id},
        {toUserId : loggedInUser._id}
      ],
      status : "accepted"
    })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);

    const data =  connectionRequests.map((row) => {
      if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({
      message : `${loggedInUser.firstName} your connections Details : `,
      data : data
    })
    
  } catch (error) {
    res.status(400).send("ERROR : " + error);
  }

})

userRouter.get('/feed', userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await connectionRequest.find({
          $or : [
            {fromUserId : loggedInUser._id},
            {toUserId : loggedInUser._id}
          ]
        }).select("fromUserId toUserId");

        const BlockedUserFromFeed = new Set();

        connectionRequests.forEach(req => {
            BlockedUserFromFeed.add(req.fromUserId.toString());
            BlockedUserFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({
          $and : [
            { _id : {$nin : Array.from(BlockedUserFromFeed)} },
            { _id : {$ne : loggedInUser._id} }
          ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)


        res.send(users);


    } catch (error) {
      res.status(400).send("ERROR : " +error.message);
    }
})



module.exports = userRouter;