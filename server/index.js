const express = require('express');
const cors = require('cors');

require('dotenv').config();  // load everything in .env file into process.env 
const connectDB = require('./configs/db');
const departmentsRouter = require('./routers/departmentsRouter');
const employeesRouter = require('./routers/employeesRouter');
const shiftsRouter = require('./routers/shiftsRouter');
const authRouter = require('./routers/authRouter');
const {verifyToken} = require('./middleware/verifyToken');

 const PORT = process.env.PORT;

const app = express();

app.use( cors());
app.use(express.json());

app.use((req, res, next) => {
  const publicRoutes = ['/auth/login', '/auth/logout'];

  // allow public access to public routes 
  if (publicRoutes.includes(req.path)) 
  {
    return next();
  }
  verifyToken(req,res,next); // for all requests apart from login,logout require a token 
});


app.use('/auth', authRouter);
app.use('/employees', employeesRouter);
app.use('/departments',departmentsRouter);
app.use('/shifts', shiftsRouter);

// Catch-all 404 middleware 
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, ()=>{
   console.log(`Listening on port: ${PORT}`) ;
   connectDB();
})