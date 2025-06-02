const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/db');

const PORT = 3000;

const app = express();

app.use( cors());
app.use(express.json());

app.listen(PORT, ()=>{
   console.log(`Listening on port: ${PORT}`) ;
   connectDB();
})