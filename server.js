'use strict';

const express=require("express");
require("dotenv").config();


const client = require("./client");
const moviesRoutes = require("./Routers/movies.routes");
const generalRoutes = require("./Routers/general.routes");
const notFoundHandler=require("./error_handlers/404");
const internalErrorHandler=require("./error_handlers/500");
const {PORT}=require("./configs");



const app=express();
app.use(express.json());
app.use(generalRoutes);
app.use('/movies',moviesRoutes);

//handle Error Functions

app.use(notFoundHandler);

app.use(internalErrorHandler);
  
  client.connect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Running at ${PORT}`);
    });
    
});


