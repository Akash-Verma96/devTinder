const mongoose = require('mongoose')

const connectDB = async function(){
    // await mongoose.connect('mongodb://localhost:27017/devTinder');
    await mongoose.connect('mongodb+srv://Akash-Webdev:Akash96%4096@cluster0.u9gqqds.mongodb.net/devTinder');
}

module.exports = {
    connectDB,
}
