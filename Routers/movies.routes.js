'use strict';

const express = require("express");
const client = require("../client");
const Router = express.Router();

//Route to  add new movie Page
Router.post("/", (req, res,next) => {
    try {
        let{t,r,p,o,c}=req.body;
    let sql=`insert into moviesDetails(title,release_date,poster_path,overview,comment) values($1,$2,$3,$4,$5)`;
    client.query(sql,[t,r,p,o,c]).then(()=>{
        res.send(`movie ${t} added to database`);
    });
    } catch (e) {
        next(`addMovie Handler : ${e}`);
    }
    
});

//Route to  get all movie Page
Router.get("/",(req,res,next)=>{
   try {
    let sql = `SELECT * from moviesDetails`;
    client.query(sql).then((moviesDetailsData) => {
      res.send(moviesDetailsData.rows);
    });
    
   } catch (e) {
    next(`getMovies Handler : ${e}`);
   }
});

//Route to  get  movie By Id
Router.get("/:id",async(req,res,next)=>{
   try{
    let {id} =req.params;
    let sql=`SELECT * FROM moviesDetails WHERE ID=${id}`;
    let data=await client.query(sql);
        res.send(data.rows)
   }catch(e){
    next(`getMovie by id Handler : ${e}`);
   }
});

//Route to  delete  movie By Id
Router.delete("/:id",async(req,res,next)=>{
    try {
        let {id} =req.params;
        let sql=`DELETE FROM moviesDetails WHERE ID =${id}`;
        let data=await client.query(sql);
        res.end();
    } catch (e) {
        next(`delete by id Handler : ${e}`);
    }
})


//Route to  update  movie By Id
Router.put("/:id",(req,res,next)=>{
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
        next(`update by id Handler : ${e}`);
    }
});

module.exports = Router;