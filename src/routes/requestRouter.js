const express = require('express')
const User = require('../models/user')
const requestRouter = express.Router();

requestRouter.post('/connectionRequest', async (req,res)=>{
    const userId = req.body.userId;

    const user = await User.findById(userId);

    res.send(`${user.firstName} ${user.lastName} sent you connection request !!!`);
})

module.exports = requestRouter;