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


router.post("/get_deals", (req, res, next) => {
  var company = req.body.company;
  const reg = new RegExp(company, 'i');

  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("listings");
      collection.find({deal: reg}).toArray().then(
        result => {
          db.close();
          res.status(200).send(result);
        },
        err => {
          db.close();
          res.status(500).send({ message: "Error" });
        }
      );
    }
  );
});


module.exports = router;
