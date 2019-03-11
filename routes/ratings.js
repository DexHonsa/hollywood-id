const express = require("express");
const router = express.Router();
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var CircularJSON = require("circular-json");
var ObjectId = require("mongodb").ObjectId;
var mkdirp = require("mkdirp");
var fs = require("fs-extra");
var crypto = require("crypto");

var URL =
  "mongodb://dexhonsa:Awesomeo21!@hid-shard-00-00-6vaxg.mongodb.net:27017,hid-shard-00-01-6vaxg.mongodb.net:27017,hid-shard-00-02-6vaxg.mongodb.net:27017/test?ssl=true&replicaSet=HID-shard-0&authSource=admin&retryWrites=true";
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./tmp/");
  },
  filename: function(req, file, cb) {
    //var datetimestamp = Date.now();
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: storage,
  onError: function(err, next) {
    console.log("error", err);
    next(err);
  }
}).single("file");


router.get("/get_rating/:id", (req, res, next) => {
  const listing_id = req.params.id;

  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("ratings");
      
      collection.find({listing_id}).toArray().then(
        result => {
          let ratings = [];
          var total = 0;
          for(let i = 0; i < result.length; i++){
            ratings.push(result[i].rating);
            total = total + Number(result[i].rating);
          }
          let avg = total / ratings.length;
          var listings = db.collection("listings");
          if(avg == null){
            avg = 0;
          }
          listings.findOneAndUpdate({_id:ObjectId(listing_id)}, {$set:{rating:avg}}).then((result2)=>{
            // console.log(result2);
            res.status(200).send({ message: "success", avg });
          })
          //res.status(200).send({ message: "success",  });
        },
        err => {
          res.status(500).send({ message: "Error" });
        }
      );
    }
  );
});

router.post("/add_rating", (req, res, next) => {
  const {listing_id, user_id, rating, comment} = req.body;
  var now = new Date();

  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("ratings");
      collection.find({listing_id, user_id}).toArray().then(result=>{
        if(result.length > 0){
          res.status(500).send({message:"You have already rated this listing."})
          return;
        }else{
          collection.insert({listing_id, rating, user_id, comment, created_at: now}).then(
            result => {
              collection.find({listing_id}).toArray().then(
                result => {
                  let ratings = [];
                  var total = 0;
                  for(let i = 0; i < result.length; i++){
                    ratings.push(result[i].rating);
                    total = total + Number(result[i].rating);
                  }
                  let avg = total / ratings.length;
                  var listings = db.collection("listings");
                  if(avg == NaN){
                    avg = 0;
                  }
                  listings.findOneAndUpdate({_id:ObjectId(listing_id)}, {$set:{rating:avg}}).then((result2)=>{
                    var listings = db.collection("listings");
                    listings.findOneAndUpdate({_id:ObjectId(listing_id)}, {$inc:{number_of_ratings:1}}).then((result2)=>{
                      res.status(200).send({ message: "success" });
                      return;
                    })  
                    // res.status(200).send({ message: "success", avg });
                  })
                  //res.status(200).send({ message: "success",  });
                },
                err => {
                  res.status(500).send({ message: "Error" });
                }
              );
    
    
    
    
    
              
              
            },
            err => {
              res.status(500).send({ message: "Error" });
              return;
            }
          );
        }
      })
      
    }
  );
});

router.post("/remove_rating", (req, res, next) => {
  const {id, listing_id }= req.body;

  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("ratings");
      
      collection.remove({_id:ObjectId(id)}).then(
        result => {
          collection.find({listing_id}).toArray().then(
            result => {
              let ratings = [];
              var total = 0;
              for(let i = 0; i < result.length; i++){
                ratings.push(result[i].rating);
                total = total + Number(result[i].rating);
              }
              var avg = total / ratings.length || 0;
              var listings = db.collection("listings");
              if(avg == NaN){
                avg = 0;
              }
              console.log(avg);
              listings.findOneAndUpdate({_id:ObjectId(listing_id)}, {$set:{rating:avg}}).then((result2)=>{
                var listings = db.collection("listings");
                listings.findOneAndUpdate({_id:ObjectId(listing_id)}, {$inc:{number_of_ratings:-1}}).then((result2)=>{
                  res.status(200).send({ message: "success" });
                  return;
                })  
                
              })
            },
            err => {
              res.status(500).send({ message: "Error" });
            }
          );
          
        },
        err => {
          res.status(500).send({ message: "Error" });
          return;
        }
      );
    }
  );
});

router.get('/get_comments/:id', (req, res)=>{
  var id = req.params.id;
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("ratings");
      collection.find({listing_id:id}).toArray().then(result=>{
        if(result.length > 0){
          res.status(200).send({results:result});
        }
      })
    })
})

router.get("/get_listing/:id", (req, res, next) => {
    
  const id = req.params.id;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("listings");
    collection.findOne({ _id: ObjectId(id) }).then(result=>{
      res.send(result);
    })
            
  });
});

router.post("/edit_listing/:id", (req, res, next) => {
  var id = req.params.id;
  var update = req.body;

  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("listings");
      collection.findOneAndUpdate( {_id: ObjectId(id)}, {$set:update}).then(
        result => {
          res.status(200).send({ message: "success" });
        },
        err => {
          res.status(500).send({ message: "Error" });
        }
      );
    }
  );
});

router.post("/add_listing", (req, res, next) => {
  var listing = req.body;

  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("listings");
      collection.insert(listing).then(
        result => {
          res.status(200).send({ message: "success" });
        },
        err => {
          res.status(500).send({ message: "Error" });
        }
      );
    }
  );
});

router.post("/add_image", (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      console.log(err);
    }
    var extension = req.file.filename.substr(-4);
    var fileName = req.file.filename;
    fs.rename(
      "./tmp/" + req.file.filename,
      "./tmp/" + fileName
    ).then(res1 => {
      fs.move(
        "./tmp/" + fileName,
        "./uploads"+'/' + fileName,
        { overwrite: false }
      ).then(result => {
          res.status(200).send({message:'uploaded'});
        // MongoClient.connect(
        //   URL,
        //   function(err, db) {
        //     if (err) throw err;
        //     var collection = db.collection("files");
        //     collection.findOne({ _id: ObjectId(fileId) }).then(result => {
        //       if (result != null) {
        //         collection
        //           .update({ _id: ObjectId(fileId) }, { $set: { image: true } })
        //           .then(result => {
        //             res.status(200).send({ message: "uploaded" });
        //           });
        //       } else {
        //         res.status(401).send({ error: err });
        //       }
        //     });
        //   }
        // );
      }).catch((err)=>{res.status(401).send({message:'already exists'})});
    });
  });
});

module.exports = router;
