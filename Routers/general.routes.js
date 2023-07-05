'use strict';

function Movie(id,title,releaseDate,posterPath,overview){
    this.id=id;
    this.title=title;
    this.release_date=releaseDate;
    this.poster_path=posterPath;
    this.overview=overview;
}

const express = require("express");
const axios = require("axios");
const Router = express.Router();
const dataFromJson=require("../MovieData/data.json");

//Route to get Home Page
Router.get("/",(req,res,next)=>{
   try {
    let newMovie=new Movie(dataFromJson.title,dataFromJson.poster_path,dataFromJson.overview);
    res.send(newMovie);
   } catch (e) {
    next(`main Handler : ${e}`);
   }
});

//Route to get favorite Page
Router.get("/favorite",(req,res,next)=>{
    
    try {
        res.send("Welcome to Favorite Page");
    } catch (e) {
        next(`favorite Handler : ${e}`);
    }
});

//Route to get trending Page
Router.get("/trending",async(req,res,next)=>{
    try {
        let newMoviesArray=[];
        let axiosResponse=await axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`);
        axiosResponse.data.results.forEach(obj => {
            newMoviesArray.push(new Movie(obj.id,obj.title,obj.release_date,obj.poster_path,obj.overview))
        });
    
        res.send(newMoviesArray);
    } catch (e) {
        next(`trending Handler : ${e}`);
    }
});

//Route to get search Page
Router.get("/search",async(req,res,next)=>{
  try {
    let newMoviesArray=[];
    let MovieTitle=req.query.name;
    let axiosResponse=await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${MovieTitle}&page=2`);
   axiosResponse.data.results.forEach(obj => {
    newMoviesArray.push(new Movie(obj.id,obj.title,obj.release_date,obj.poster_path,obj.overview))
});
    res.send(newMoviesArray);
  } catch (e) {
    next(`search Handler : ${e}`);
  }
    
});

//Route to get top_rated Page
Router.get("/top_rated",async (req,res,next)=>{
    try {
        let axiosResponse=await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.APIKEY}`);
        res.send(axiosResponse.data); 
    } catch (e) {
        next(`top_rated Handler : ${e}`);
    }
});


//Route to get upcoming Page
Router.get("/upcoming",async (req,res,next)=>{
   try {
    let axiosResponse=await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.APIKEY}`);
    res.send(axiosResponse.data);
   } catch (e) {
    next(`upcoming Handler : ${e}`);
   }
});

module.exports = Router;