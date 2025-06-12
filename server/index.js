const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/db');
const departmentsRouter = require('./routers/departmentsRouter');
const employeesRouter = require('./routers/employeesRouter');
const shiftsRouter = require('./routers/shiftsRouter');

const PORT = 3000;

const app = express();

app.use( cors());
app.use(express.json());
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