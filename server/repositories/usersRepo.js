const User = require('../models/userModel');

const getUserById = (userId)=>{
      return User.findById(userId);
}


module.exports = { getUserById };