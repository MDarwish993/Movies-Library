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
const pg=require("pg");

app.use(express.json());

const dbUrl=process.env.DBURL;
const client=new pg.Client(dbUrl);


//My Application Routes

//Route to get Home Page
app.get("/",(req,res)=>{
    let newMovie=new Movie(dataFromJson.title,dataFromJson.poster_path,dataFromJson.overview);
    res.send(newMovie);
});

//Route to get favorite Page
app.get("/favorite",(req,res)=>{
    res.send("Welcome to Favorite Page");
});

//Route to get trending Page
app.get("/trending",async(req,res)=>{
    let newMoviesArray=[];
    let axiosResponse=await axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`);
    axiosResponse.data.results.forEach(obj => {
        newMoviesArray.push(new Movie(obj.id,obj.title,obj.release_date,obj.poster_path,obj.overview))
    });

    res.send(newMoviesArray);
});

//Route to get search Page
app.get("/search",async(req,res)=>{
    let newMoviesArray=[];
    let MovieTitle=req.query.name;
    let axiosResponse=await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${MovieTitle}&page=2`);
   axiosResponse.data.results.forEach(obj => {
    newMoviesArray.push(new Movie(obj.id,obj.title,obj.release_date,obj.poster_path,obj.overview))
});
    res.send(newMoviesArray);
    
});

//Route to get top_rated Page
app.get("/top_rated",async (req,res)=>{
    let axiosResponse=await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.APIKEY}`);
    res.send(axiosResponse.data);
});


//Route to get upcoming Page
app.get("/upcoming",async (req,res)=>{
    let axiosResponse=await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.APIKEY}`);
    res.send(axiosResponse.data);
});

//Route to  add new movie Page
app.post("/addMovie", (req, res) => {
    let{t,r,p,o,c}=req.body;
    let sql=`insert into moviesDetails(title,release_date,poster_path,overview,comment) values($1,$2,$3,$4,$5)`;
    client.query(sql,[t,r,p,o,c]).then(()=>{
        res.send(`movie ${t} added to database`);
    });
    
});

//Route to  get all movie Page
app.get("/getMovies",(req,res)=>{
    let sql = `SELECT * from moviesDetails`;
  client.query(sql).then((moviesDetailsData) => {
    res.send(moviesDetailsData.rows);
  });
});

//Route to  get  movie By Id
app.get("/getMovie/:id",async(req,res)=>{
   try{
    let {id} =req.params;
    let sql=`SELECT * FROM moviesDetails WHERE ID=${id}`;
    let data=await client.query(sql);
        res.send(data.rows)
   }catch(e){
    next("getMovie"+e);
   }
});

//Route to  delete  movie By Id
app.delete("/delete/:id",async(req,res)=>{
    try {
        let {id} =req.params;
        let sql=`DELETE FROM moviesDetails WHERE ID =${id}`;
        let data=await client.query(sql);
        res.end();
    } catch (e) {
        next("Delete route"+e);
    }
})


//Route to  update  movie By Id
app.put("/update/:id",(req,res)=>{
    try {
        let {newComment}=req.body;
        let {id}=req.params;
        let sql=`SELECT * FROM moviesDetails WHERE ID=${id}`;
            client.query(sql).then((movieData)=>{
                const {title,releaseDate,posterPath,overview,comment}=movieData.rows[0];
                let sqlU = ` UPDATE moviesDetails SET comment=$1 WHERE id=${id}`;
                client.query(sqlU,[newComment]).then((data)=>{
                    res.send(`Updated`);
                })
            });
    } catch (e) {
        next("update route "+e);
    }
});


//handle Error Functions

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send({
        "status": 500,
        "responseText": "Sorry, something went wrong"
        })
  });

app.use(function(req, res, next) {
    res.status(404).send({
        "status": 404,
        "responseText": "Sorry, Page Not Found"
        })
  });
  
  client.connect().then(()=>{
    app.listen(3000,()=>{
        console.log("Running at 3000");
    });
    
});


