const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//     const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

const turnApiIdToObjectId = (id) =>{

    let id_str;
    const my_id_num = +id;

    const ids_base = "0010000000000000000000";
   
    id_str = my_id_num < 10 ? ids_base+'0'+id : ids_base+id;
    return (id_str); 
}

const verifyApiUser = async (username,email)=>{
    
    const result = { isVerified:false, id:0, username,email};
    const {data: users} = await axios.get(process.env.USERS_URL);
    const user = users.find( (user)=> { return user.username===username && user.email===email });
    if (user!==null && user !== undefined)
    {
        result.isVerified = true;
        result.id = user.id;   // this is the id coming from the api (1,2,3 ,... etc)
        result.userId = turnApiIdToObjectId(user.id); // the userId is the id used in the users collection 
    }
    return result;
}

router.post('/login', async (req,res)=>{
  const { username, email } = req.body;
  
  const result = await verifyApiUser(username,email);
  if (result.isVerified)
  {
        const payload = { id: result.id, userId: result.userId ,username: result.username , email: result.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN }); // '1h'
        res.json({ token });       
  }
  else
  {
        return res.status(401).json({ message: 'Invalid credentials' });
  }

});

module.exports = router;