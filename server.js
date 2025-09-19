const express = require('express');
const mongoose = require('mongoose');
const recipeRouter = require('./router/recipeRouter');
const cors = require('cors');

require("dotenv").config();

const app = express();


app.use(cors());
app.use(express.json())
app.use(recipeRouter);

app.listen(process.env.PORT, (err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Vous êtes connecté au serveur sur le port:" + process.env.PORT);
    }
})

mongoose.connect("mongodb://localhost:27017/projet-recettes-node")