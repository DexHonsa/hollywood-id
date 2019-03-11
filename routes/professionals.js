const express = require("express");
const router = express.Router();
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var CircularJSON = require("circular-json");
var ObjectId = require("mongodb").ObjectId;
var crypto = require("crypto");

var URL =
"mongodb://dexhonsa:Awesomeo21!@hid-shard-00-00-6vaxg.mongodb.net:27017,hid-shard-00-01-6vaxg.mongodb.net:27017,hid-shard-00-02-6vaxg.mongodb.net:27017/test?ssl=true&replicaSet=HID-shard-0&authSource=admin&retryWrites=true";

  router.post("/search", (req, res, next) => {
    const { term, categories, page } = req.body;
    console.log(categories);
    const reg = new RegExp(term, 'i');
    var skip = page * 10 - 10;
    var query = {name: reg , $or: []};
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
    for(var i = 0; i < categories.length; i++){
      query.$or.push({titles: {$all: [capitalizeFirstLetter(categories[i])]}})
    }
    if(categories.length == 0){
      query = {$or: [{name: reg}, {rep_name: {$regex: reg}}]}
    }
    console.log(query);
    MongoClient.connect(URL, function(err, db) {
      if (err) throw err;
      var collection = db.collection("listings");
      var call = collection.find(query).sort({name:1}).skip(skip).limit(10);
      

      call.toArray(function(err, result){
        
        collection.count(query).then(count=>{
          res.send({query, items:result, total:count});
          // res.send({items:result, total:count});
        })
       
      })
    });
  });

  router.post("/search_pending", (req, res, next) => {
    const { term, categories, page } = req.body;
    console.log(categories);
    const reg = new RegExp(term, 'i');
    var skip = page * 10 - 10;
    var query = {name: reg , $or: []};
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
    for(var i = 0; i < categories.length; i++){
      query.$or.push({titles: {$all: [capitalizeFirstLetter(categories[i])]}})
    }
    if(categories.length == 0){
      query = {$or: [{name: reg}, {rep_name: {$regex: reg}}]}
    }
    console.log(query);
    MongoClient.connect(URL, function(err, db) {
      if (err) throw err;
      var collection = db.collection("pending_listings");
      var call = collection.find(query).sort({name:1}).skip(skip).limit(10);
      

      call.toArray(function(err, result){
        
        collection.count(query).then(count=>{
          res.send({query, items:result, total:count});
          // res.send({items:result, total:count});
        })
       
      })
    });
  });

  router.get("/autocomplete",(req,res)=>{
    var term = req.query.term;
    var query = "^"+term+".*"
    console.log(query);
    MongoClient.connect(URL, function(err, db) {
      var collection = db.collection("listings");
      collection.find({name:{$regex:query, $options : 'i'}}).toArray().then(result=>{
        res.status(200).json(result);
      })
    })
  })

  router.get("/search/:id", (req, res, next) => {
    
    const id = req.params.id;
    MongoClient.connect(URL, function(err, db) {
      if (err) throw err;
      var collection = db.collection("listings");
      collection.findOne({ _id: ObjectId(id) }).then(result=>{
        res.send(result);
      })
              
    });
  });

  router.get("/search_pending/:id", (req, res, next) => {
    
    const id = req.params.id;
    MongoClient.connect(URL, function(err, db) {
      if (err) throw err;
      var collection = db.collection("pending_listings");
      collection.findOne({ _id: ObjectId(id) }).then(result=>{
        res.send(result);
      })
              
    });
  });

  router.get("/approve_pending_listing/:id", (req, res, next) => {
    
    var id = req.params.id;
    console.log(id)
    MongoClient.connect(URL, function(err, db) {
      if (err) throw err;
      var collection = db.collection("pending_listings");
      collection.findOne({ _id: ObjectId(id) }).then(result=>{
        console.log(result);
        var listings = db.collection("listings");
        listings.insert(result).then(result2=>{
          collection.remove({_id:ObjectId(id)}).then(result3=>{
            res.status(200).send({message:'success'});
          })
        })
        res.send(result);
      })
              
    });
  });

  router.get("/reject_pending_listing/:id", (req, res, next) => {
    
    const id = req.params.id;
    MongoClient.connect(URL, function(err, db) {
      if (err) throw err;
      var collection = db.collection("pending_listings");
      collection.findOneAndUpdate({ _id: ObjectId(id) }, {$set:{pending:false}}).then(result=>{
        res.status(200).send({message:"success"})
      })
              
    });
  });

  module.exports = router;