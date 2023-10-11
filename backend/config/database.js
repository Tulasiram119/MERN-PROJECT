const mongoose = require('mongoose');
const connectToDatabase = ()=>{
    mongoose.connect(process.env.DB_URI).then((data)=>{
        console.log(`Mongodb connected succesfully :${data.connection.host}`);
    });
}
module.exports = connectToDatabase;