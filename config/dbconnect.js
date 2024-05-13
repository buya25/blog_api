const mongoose = require('mongoose');

//function to connect

const dbconnect = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('DB connected successfully');
    }catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

dbconnect();