'use strict';

function Movie(id,title,releaseDate,posterPath,overview){
    this.id=id;
    this.title=title;
    this.release_date=releaseDate;
    this.poster_path=posterPath;
    this.overview=overview;
}


const express=require("express");
const dataFromJson=require("./MovieData/data.json");
const axios = require("axios");
require("dotenv").config();
const app=express();


app.get("/",handleServerPage);

app.get("/favorite",handleFavoritePage);



app.get("/trending",async(req,res)=>{
    let newMoviesArray=[];
    let axiosResponse=await axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`);
    axiosResponse.data.results.forEach(obj => {
        newMoviesArray.push(new Movie(obj.id,obj.title,obj.release_date,obj.poster_path,obj.overview))
    });

    res.send(newMoviesArray);
});


app.get("/search",async(req,res)=>{
    let newMoviesArray=[];
    let MovieTitle=req.query.name;
    let axiosResponse=await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${MovieTitle}&page=2`);
   // let searchByNames =axiosResponse.data.results.filter(obj=> obj.title == MovieTitle);
   axiosResponse.data.results.forEach(obj => {
    newMoviesArray.push(new Movie(obj.id,obj.title,obj.release_date,obj.poster_path,obj.overview))
});
    res.send(newMoviesArray);
    
});

//my own rout

app.get("/top_rated",async (req,res)=>{
    let axiosResponse=await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.APIKEY}`);
    res.send(axiosResponse.data);
})



app.get("/upcoming",async (req,res)=>{
    let axiosResponse=await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.APIKEY}`);
    res.send(axiosResponse.data);
})




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