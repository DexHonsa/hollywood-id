const express = require("express");
const router = express.Router();
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var CircularJSON = require("circular-json");
var ObjectId = require("mongodb").ObjectId;
var jwt = require("jsonwebtoken");
var config = require("../config");
var crypto = require("crypto");
var fs = require("fs-extra");

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

router.get("/get_admins", (req, res)=>{
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection
        .find({ "role": "admin" }).toArray().then(result=>{
          if(result.length > 0){
            res.status(200).send({message:'success', result});
          }else{
            res.status(500).send({message:'error'});
          }
        })

        
    }
  );
})


router.post("/add_admin", (req, res)=>{
  var email = req.body.email;
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection
        .findOneAndUpdate({ "email": email }, {$set:{role:'admin'}}).then(result=>{
          
          if(result.value != null){
            res.status(200).send({message:'success'});
          }else{
            res.status(500).send({message:'User not found'});
          }
        },err=>{
          res.status(500).send({message:'User not found'});
        })
    }
  );
})

function makeid() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

router.post("/add_new_user", (req, res)=>{
  var email = req.body.email;
  var tmpPass = makeid();

  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection
        .insert({ "email": email }, {$set:{role:'admin'}}).then(result=>{
          
          if(result.value != null){
            res.status(200).send({message:'success'});
          }else{
            res.status(500).send({message:'User not found'});
          }
        },err=>{
          res.status(500).send({message:'User not found'});
        })
    }
  );
})

router.post("/remove_admin", (req, res)=>{
  var email = req.body.email;
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection
        .findOneAndUpdate({ "email": email }, {$set:{role:'normal'}}).then(result=>{
          if(result != null){
            res.status(200).send({message:'success'});
          }else{
            res.status(500).send({message:'error'});
          }
        })
    }
  );
})
router.get("/", (req, res, next) => {
  var token = req.headers["authorization"];
  if (token == null) {
    res.status(500).send({ auth: false, message: "No token provided." });
  }
  // token = token.split(" ");
  // if (!token[1]) {
  //   return res.status(401).send({ auth: false, message: "No token provided." });
  // }
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      var users = collection
        .find({})
        .toArray()
        .then(result => {
          res.json(result);
        });
    }
  );
});
router.post("/", (req, res, next) => {
  var token = req.headers["authorization"];
  token = token.split(" ");
  if (!token[1])
    return res.status(401).send({ auth: false, message: "No token provided." });
  const { username, password, email } = req.body;
  var passwordHash = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");
  //console.log(username, password, email);
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection
        .insert({ username: username, password: passwordHash, email: email })

        .then(result => {
          res.json(result);
        });
    }
  );
});

router.get("/:id", (req, res)=>{
  var id = req.params.id;
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection
        .findOne({ _id: ObjectId(id) }).then(result=>{
          if(result != null){
            res.status(200).send({message:'success', user:result});
          }else{
            res.status(500).send({message:'error'});
          }
        })

        
    }
  );
})

router.get("/user/:id", (req, res) => {
  var id = req.params.id;
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection.findOne({ _id: ObjectId(id) }).then(result => {
        if (result != null) {
          var token = jwt.sign({ id: result._id, role:result.role, email: result.email, is_active:result.is_active, first_name: result.first_name, last_name:result.last_name, cus_id:result.cus_id, sub_id: result.sub_id, image:result.image }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          res.status(200).send({ message: 'success', token });
        } else {
          // res.status(500).send({ message: "error" });
        }
      });
    }
  );
});

router.patch("/:id", (req, res, next) => {
  var token = req.headers["authorization"];
  token = token.split(" ");
  if (!token[1])
    return res.status(401).send({ auth: false, message: "No token provided." });
  const id = req.params.id;
  const { username, password, email } = req.body;
  var passwordHash = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");

  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection
        .update(
          { _id: ObjectId(id) },
          { username: username, password: passwordHash, email: email }
        )

        .then(result => {
          res.json(result);
        });
    }
  );
});
router.delete("/:id", (req, res, next) => {
  var token = req.headers["authorization"];
  token = token.split(" ");
  if (!token[1])
    return res.status(401).send({ auth: false, message: "No token provided." });
  const id = req.params.id;
  const { username, password, email } = req.body;
  //console.log(username, password, email);
  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection.remove({ _id: ObjectId(id) }).then(result => {
        res.json(result);
      });
    }
  );
});

router.post("/add_image/:id", (req, res, next) => {
  const id = req.params.id;
  console.log("OK");

  upload(req, res, function(err) {
    if (err) {
      console.log(err);
    }
    var extension = req.file.filename.substr(-4);
    var fileName = req.file.filename;
    console.log(req.file.filename);
    fs.rename("./tmp/" + req.file.filename, "./tmp/" + fileName).then(res1 => {
      fs.move("./tmp/" + fileName, "./user_uploads" + "/" + fileName, {
        overwrite: false
      })
        .then(result => {
          // res.status(200).send({message:'uploaded'});
          MongoClient.connect(
            URL,
            function(err, db) {
              if (err) throw err;
              var collection = db.collection("users");

              collection.findOne({ _id: ObjectId(id) }).then(result => {
                // console.log(result);
                if (result != null) {
                  //console.log(result);
                  res.send("success");
                  collection
                    .update(
                      { _id: ObjectId(id) },
                      { $set: { image: fileName } }
                    )
                    .then(result => {
                      res
                        .status(200)
                        .send({ message: "uploaded", filename: fileName });
                    });
                } else {
                  res.status(401).send({ error: "none found" });
                }
              });
            }
          );
        })
        .catch(err => {
          res.status(401).send({ message: "already exists" });
        });
    });
  });
});



module.exports = router;
