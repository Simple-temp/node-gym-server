const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload")
require("dotenv").config()
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ka9ky.mongodb.net/${process.env.BD_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}))
app.use(fileUpload())



client.connect(err => {

  const collection = client.db("gymtype").collection("gymtype");

  app.post("/postgymitem",(req,res)=>{
    const file = req.files.file;
    const title = req.body.title;
    const des = req.body.des;
    const key = req.body.key;
    const newImg = file.data;
    const encImg = newImg.toString("base64");
    var image = {
      fileName : file.name,
      fileSize : file.size,
      fileType : file.mimetype,
      img : Buffer.from(encImg,"base64"),
    }
    collection.insertOne({image,title,des,key})
    .then(function(result){
      res.send(result.insertedCount > 0)
    })

  })

  app.get("/getgymservices",(req,res)=>{
    collection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get("/selcetedgym/:id",(req,res)=>{
    collection.find({})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })


  console.log("connected db")
});



app.get("/",(req,res)=>{
    res.send("gym website")
})

const port = 4000;

app.listen(process.env.PORT || port,console.log("running port 4000"))