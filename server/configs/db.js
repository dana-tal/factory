const mongoose = require('mongoose');

const connectDB = () =>{

    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/factoryDB';

   // const mongoURI = 'mongodb://localhost:27017/factoryDB';

    mongoose.connect(mongoURI,{
        serverSelectionTimeoutMS: 3000  // fail fast after 3 seconds
        })
    .then( ()=>{
        console.log("Successfully connected to factoryDB");
    })
    .catch( err=> {
        console.log(err);
      }
    )
}

module.exports = connectDB;