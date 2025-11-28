const mongoose = require('mongoose')

const connectDB = async function(){
    await mongoose.connect('mongodb://localhost:27017/devTinder');
}

module.exports = {
    connectDB,
}