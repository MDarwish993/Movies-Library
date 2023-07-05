'use strict';

const pg=require("pg");
const{DBURL}=require("./configs");
const client=new pg.Client(DBURL);

module.exports = client;