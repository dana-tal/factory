const express = require('express');
const cors = require('cors');
const session = require('express-session');

require('dotenv').config();  // load everything in .env file into process.env 
const connectDB = require('./configs/db');
const departmentsRouter = require('./routers/departmentsRouter');
const employeesRouter = require('./routers/employeesRouter');
const shiftsRouter = require('./routers/shiftsRouter');
const authRouter = require('./routers/authRouter');
const usersRouter = require('./routers/usersRouter');
const {verifyToken} = require('./middleware/verifyToken');
const { limitDailyActions } = require('./middleware/limitActions');

 const PORT = process.env.PORT;

const app = express();

app.use( cors());
app.use(express.json());


const  sessionMiddleware= session({
  secret: process.env.SESSION_SECRET,    // the secret prevents tampering with the session ID on the client side  
  resave: false,                      // if resave is true it forces the session to be written to the store (Redis, memory,db), even if it was not modified
  saveUninitialized: false,         // when true a session will be stored even if it has no data ,so false gaurantees we don't send cookies to unlogged users 
  name:'FactorySessionId',        // this is the cookie name
  cookie: { maxAge: +process.env.COOKIE_MAX_AGE  || 24 * 60 * 60 * 1000  }    // controlls the cookie behavior (the cookie that stores the session ID), 1 day fallback
})

// Set up session middleware
app.use(sessionMiddleware);

app.use((req, res, next) => {
  const publicRoutes = ['/auth/login', '/auth/logout'];

  // allow public access to public routes 
  if ( publicRoutes.includes(req.path)) 
  {
     return next();  
  }
  return verifyToken(req, res, next); // for all requests apart from login,logout require a token , this will also inject a req.user field containing user data
                                      // the return ensures that nothing is run in case verifyToken resoneded 
});

app.use((req, res, next) => {
  const publicRoutes = ['/auth/login', '/auth/logout'];

  // allow public access to public routes 
  if ( publicRoutes.includes(req.path)) 
  {
     return next();  
  }
  return limitDailyActions(req,res,next) ; // check the user has not reached his actions counter limit (also updates his counter)
});  



app.use('/auth', authRouter);
app.use('/employees', employeesRouter);
app.use('/departments',departmentsRouter);
app.use('/shifts', shiftsRouter);
app.use('/users', usersRouter);

// Catch-all 404 middleware 
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, ()=>{
   console.log(`Listening on port: ${PORT}`) ;
   connectDB();
})