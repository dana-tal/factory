
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) 
{
  
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: 'You must login before performing any request' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => 
    {
        if (err) 
        {
            delete req.session.token ; // since the token was found invalid, no need to keep it 
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = decoded; // decoded is returned when jwt.verify succeeds, 
                            // and it contains the payload we passed when creating the token
                            // so, we can add the user credetials to the request info 
        next();
    });
}

module.exports = {verifyToken};