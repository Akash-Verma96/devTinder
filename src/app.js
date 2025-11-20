const express = require('express')
const {adminAuth, userAuth} = require('./middlewares/auth')

const {connectDB} = require('./config/database')
const User = require('./models/user')

const app = express();


const port = 3000;

app.post('/signup', async (req,res)=>{

    const user = new User({
        firstName : "Rohit",
        lastName : "Sharma",
        emailId : "rohit@gmail.com",
        password:"rohit123",
        age : 41,
        gender : "Male",
    })

    try {
        await user.save();
        res.send("Data added to database Succesfully...");
    } catch (error) {
        res.status(404).send("Error while saving data to database...");
    }
})

connectDB()
.then(()=>{
    console.log("Database Connected Succesfully...");
})
.catch((err) => console.log("Database connection failed..."));


app.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
})