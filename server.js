'use strict';

function Movie(title,posterPath,overview){
    this.title=title;
    this.poster_path=posterPath;
    this.overview=overview;
}


const express=require("express");
const dataFromJson=require("./MovieData/data.json");

const app=express();


app.get("/",handleServerPage);

app.get("/favorite",handleFavoritePage);



function handleServerPage(req,res){
    let newMovie=new Movie(dataFromJson.title,dataFromJson.poster_path,dataFromJson.overview);
    res.send(newMovie);
}

function handleFavoritePage(req,res){
    res.send("Welcome to Favorite Page");
}

//handle Error Functions

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send({
        "status": 500,
        "responseText": "Sorry, something went wrong"
        })
  })

app.use(function(req, res, next) {
    res.status(404).send({
        "status": 404,
        "responseText": "Sorry, Page Not Found"
        })
  })
  


app.listen(3000,startingLog);

function startingLog(req,res){
    console.log("Running at 3000");
}