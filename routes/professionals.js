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
    
    const reg = new RegExp(term, 'i');
    var skip = page * 10 - 10;
    var query = {post_title: reg , $or: []};
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
    for(var i = 0; i < categories.length; i++){
      query.$or.push({titles: {$all: [capitalizeFirstLetter(categories[i])]}})
    }
    if(categories.length == 0){
      query = {$or: [{post_title: reg}, {rep_name: {$regex: reg}}]}
    }
    
    MongoClient.connect(URL, function(err, db) {
      if (err) throw err;
      var collection = db.collection("listings");
      var call = collection.find(query).sort({post_title:1}).skip(skip).limit(10);
      

      call.toArray(function(err, result){
        
        collection.count(query).then(count=>{
          db.close();
          res.send({query, items:result, total:count});
          // res.send({items:result, total:count});
        })
       
      })
    });
  });

  router.get('/update_ratings', (req, res)=>{
    MongoClient.connect(URL, function(err, db){
      if(err) throw err;
      var collection = db.collection('listings');
      collection.find({rating:null}).toArray().then(results=>{
        for(let p = 0; p < results.length; p++){
          collection.findOneAndUpdate({_id:ObjectId(results[p]._id)}, {$set:{rating: 0, number_of_ratings:0}}).then(result=>{
            res.send({result:result});
          })
        }
      })
    })
  })

  router.post("/search_pending", (req, res, next) => {
    const { term, categories, page } = req.body;
    console.log(categories);
    const reg = new RegExp(term, 'i');
    var skip = page * 10 - 10;
    var query = {post_title: reg , $or: []};
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
    for(var i = 0; i < categories.length; i++){
      query.$or.push({titles: {$all: [capitalizeFirstLetter(categories[i])]}})
    }
    if(categories.length == 0){
      query = {$or: [{post_title: reg}, {rep_name: {$regex: reg}}]}
    }
    console.log(query);
    MongoClient.connect(URL, function(err, db) {
      if (err) throw err;
      var collection = db.collection("pending_listings");
      var call = collection.find(query).sort({name:1}).skip(skip).limit(10);
      

      call.toArray(function(err, result){
        
        collection.count(query).then(count=>{
          db.close();
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
      collection.find({post_title:{$regex:query, $options : 'i'}}).toArray().then(result=>{
        db.close();
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
        db.close();
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
        db.close();
        res.send(result);
      })
              
    });
  });

  router.get("/approve_pending_listing/:id", (req, res, next) => {
    var id = req.params.id;

    MongoClient.connect(URL, function(err, db) {
      if (err) throw err;
      var collection = db.collection("pending_listings");
      collection.findOne({ _id: ObjectId(id) }).then(result=>{

        var listings = db.collection("listings");
        listings.insert(result).then(result2=>{
          collection.remove({_id:ObjectId(id)}).then(result3=>{
            db.close();
            res.status(200).send({message:'success'});
          })
        })
        db.close();
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
        db.close();
        res.status(200).send({message:"success"})
      })
              
    });
  });

  module.exports = router;