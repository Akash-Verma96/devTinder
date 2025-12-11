const express = require('express')

const {connectDB} = require('./config/database')
const cookie_parser = require('cookie-parser')
const authRouter = require('./routes/authRouter')
const profileRouter = require('./routes/profileRouter')
const requestRouter = require('./routes/requestRouter')
const userRouter = require('./routes/user')

const app = express();
const port = 3000;

app.use(express.json()); // to read _id of mongodb
app.use(cookie_parser()); // to read cookie token




app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter)





// connecting database
connectDB()
    .then(() => {
        console.log("Database Connected Successfully...");
        app.listen(port, () => {
            console.log(`Server is up on port ${port}`);
        });
    })
    .catch(err => {
        console.log("Database connection failed...", err);
    });
