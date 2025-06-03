const mongoose = require('mongoose');

const connectDB = () =>{

    mongoose.connect('mongodb://localhost:27017/factoryDB',{
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