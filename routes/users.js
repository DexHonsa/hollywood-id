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
var nodemailer = require("nodemailer");
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
            db.close();
            res.status(200).send({message:'success', result});
          }else{
            db.close();
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
            db.close();
            res.status(200).send({message:'success'});
          }else{
            db.close();
            res.status(500).send({message:'User not found'});
          }
        },err=>{
          db.close();
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
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var token = makeid();
  var tokenHash = crypto
    .createHash("md5")
    .update(token)
    .digest("hex");

  MongoClient.connect(
    URL,
    function(err, db) {
      if (err) throw err;
      var collection = db.collection("users");
      collection.find({email:email}).toArray().then(array=>{
        if(array.length == 0){
          collection
          .insert({
            email: email.toLowerCase().trim(),
            password: tokenHash,
            role: "normal",
            first_name,
            last_name,
            is_active:true,
            created_at: new Date(),
            //is_active:false,
            password_reset:true
          }).then(result=>{
            
            if(result != null){
              res.status(200).send({message:'success'});
              let transporter = nodemailer.createTransport({
                service: "gmail",
                secure: false,
                port: 25,
                auth: {
                  user: "dexhonsa@gmail.com",
                  pass: "Awesomeo21!23!24!"
                },
                tls: {
                  rejectUnauthorized: false
                }
              });
    
              const emailOutputToUser = `
        <div style="background:#f8f8f8; text-align: center; width:100%; padding:30px 15px;box-sizing: border-box;">
        <div style="max-width: 500px; width:100%; background:#fff; text-align: center;display: inline-block; border:solid 1px #eaeaea; border-radius: 3px;box-sizing: border-box;">
        <div>
        <img src="https://hollywood-id.com/img/hollywood_blue_blur.cd0a2825.jpg" alt="" width="100%">
        </div>
        <div style="margin-top:10px;">
          <img src="https://hollywood-id.com/img/logo_black.63f50681.png" alt="" style="max-height:100px; padding-left:15px; max-width:90%;">
        </div>
        <div style="padding:15px">
          <div style="color:#000;  font-size: 12pt; font-family: Arial; font-weight: bold; margin:10px 0px; display: inline-block">Welcome to HID!</div>
          <div style=" font-size: 10pt; padding:15px;
          color:#808080;
          font-family:Arial;
          ">
            Your account is setup and waiting for you! Please login to your account with your temporary password <a href="https://hollywood-id.com/">here</a>
          </div>
          <div style="font-size:15pt; color:#000; font-weight:bold; border:solid 1px #eaeaea; border-radius:3px; padding:15px;">${token}</div>
          <div style=" font-size: 10pt; padding:15px;
          color:#808080;
          font-family:Arial;
          ">
            Please use this token to login to your account and change your password.
          </div>
          </div>
          
        </div><br>
        <div style="display: inline-block; font-size: 10pt;
          font-family:Arial; color:#AFAFAF; margin-top:15px">
            Hollywood Insider Directory | 77900 Country Club Dr | Palm Desert, CA 92211
          </div>
          </div>
        `;
    
              let mailOptionsToUser = {
                from: '"Hollywood ID" <support@hid.com>', // sender address
                to: email, // list of receivers
                subject: "Youve been invited to join the Hollywood Insider Directory!", // Subject line
                text: "Hello world?", // plain text body
                html: emailOutputToUser // html body
              };
    
              transporter.sendMail(mailOptionsToUser, (error, info) => {
                if (error) {
                  return console.log(error);
                }
                console.log("User sent: %s", info.messageId);
              });
              db.close();
              res.send({ message: "sent" });
            }
          },err=>{
            db.close();
            res.status(500).send({message:'Error'});
          })
        }else{
          db.close();
          res.status(500).send({message:'User has already been invited'})
        }
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
            db.close();
            res.status(200).send({message:'success'});
          }else{
            db.close();
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
          db.close();
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
          db.close();
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
            db.close();
            res.status(200).send({message:'success', user:result});
          }else{
            db.close();
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
          db.close();
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
          db.close();
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
        db.close();
        res.json(result);
      });
    }
  );
});

router.post("/add_image/:id", (req, res, next) => {
  const id = req.params.id;

  upload(req, res, function(err) {
    if (err) {
      console.log(err);
    }
    var extension = req.file.filename.substr(-4);
    var fileName = req.file.filename;

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
                if (result != null) {

                  res.send("success");
                  collection
                    .update(
                      { _id: ObjectId(id) },
                      { $set: { image: fileName } }
                    )
                    .then(result => {
                      db.close();
                      res
                        .status(200)
                        .send({ message: "uploaded", filename: fileName });
                    });
                } else {
                  db.close();
                  res.status(401).send({ error: "none found" });
                }
              });
            }
          );
        })
        .catch(err => {
          db.close();
          res.status(401).send({ message: "already exists" });
        });
    });
  });
});



module.exports = router;
