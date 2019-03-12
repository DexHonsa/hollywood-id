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


router.post("/add", (req, res, next) => {
  
  var docs = req.body;
  var user = docs.created_by;


  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      
      var collection = db.collection("listings");
      collection.insertMany(docs).then(
        result => {
          db.close();
          res.status(200).send({ message: "success" });
        },
        err => {
          db.close();
          res.status(500).send({ message: "Error" });
        }
      );
    }
  );
});

router.get("/get_listing/:id", (req, res, next) => {
    
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
          db.close();
          res.status(200).send({ message: "success" });
        },
        err => {
          db.close();
          res.status(500).send({ message: "Error" });
        }
      );
    }
  );
});

router.delete("/delete/:id", (req, res, next) => {
  var id = req.params.id;
   console.log(id);
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("listings");
      collection.deleteOne( {_id: ObjectId(id)}).then(
        result => {
          db.close();
          res.status(200).send({ message: "success" });
        },
        err => {
          db.close();
          res.status(500).send({ message: "Error" });
        }
      );
    }
  );
});

router.post("/add_listing", (req, res, next) => {
  var listing = req.body;
  var user = listing.created_by;
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var userCollection = db.collection('users');
      userCollection.findOne({_id:ObjectId(user)}).then(result2=>{
        if(result2.role == 'admin'){
          var collection = db.collection("listings");
          collection.insert(listing).then(
            result => {
              db.close();
              res.status(200).send({ message: "success" });
            },
            err => {
              db.close();
              res.status(500).send({ message: "Error" });
            }
          );
        }else{
          var collection = db.collection("pending_listings");
          collection.insert(listing).then(
            result => {
              db.close();
              res.status(200).send({ message: "success", pending: true });
            },
            err => {
              db.close();
              res.status(500).send({ message: "Error" });
            }
          );
        }
        
      })
      
    }
  );
});

router.post("/claim_listing", (req, res, next) => {
  const {user_id, listing_id} = req.body;
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var userCollection = db.collection('pending_claims');
      

    })

})

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
        db.close();
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
      }).catch((err)=>{db.close(); res.status(401).send({message:'already exists'})});
    });
  });
});

module.exports = router;
