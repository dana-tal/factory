
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) 
{
  const authHeader = req.headers['authorization'];

  if (!authHeader) // the token is missing
  {
     return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // since the autorization header will look like : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." , we need the second word

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => 
    {
        if (err) 
        {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = decoded; // decoded is returned when jwt.verify succeeds, 
                            // and it contains the payload we passed when creating the token
                            // so, we can add the user credetials to the request info 
        next();
    });
}

module.exports = {verifyToken};