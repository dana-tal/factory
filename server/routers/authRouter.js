const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');




const verifyUser = async (username,email)=>{

    const result = { isVerified:false, id:0, username,email};

    const {data: users} = await axios.get(process.env.USERS_URL);
    const user = users.find( (user)=> { return user.username===username && user.email===email });
    if (user!==null && user !== undefined)
    {
        result.isVerified = true;
        result.id = user.id;
    }
    return result;
}

router.post('/login', async (req,res)=>{
  const { username, email } = req.body;
  
  const result = await verifyUser(username,email);
  if (result.isVerified)
  {
        const payload = { id: result.id, username: result.username , email: result.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN }); // '1h'
        res.json({ token });       
  }
  else
  {
        return res.status(401).json({ message: 'Invalid credentials' });
  }

});

module.exports = router;