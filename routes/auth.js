const express = require("express");
const router = express.Router();
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var CircularJSON = require("circular-json");
var ObjectId = require("mongodb").ObjectId;
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var config = require("../config");
var nodemailer = require("nodemailer");
var stripe = require("stripe")("sk_test_CLIhgZyyAMDTGBheTNMRedfP");

var URL =
  "mongodb://dexhonsa:Awesomeo21!@hid-shard-00-00-6vaxg.mongodb.net:27017,hid-shard-00-01-6vaxg.mongodb.net:27017,hid-shard-00-02-6vaxg.mongodb.net:27017/test?ssl=true&replicaSet=HID-shard-0&authSource=admin&retryWrites=true";

router.post("/", (req, res, next) => {
  const { email, password } = req.body;
  var lowercase = email.toLowerCase();
  var passwordHash = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("users");
    collection.findOne({ email: lowercase, password: passwordHash }).then(
      result => {
        if (result != null) {
          if (result.sub_id != "" && result.sub_id != null) {
            stripe.subscriptions.retrieve(
              result.sub_id,
              (err, subscriptions) => {
                if (err) {
                  db.close();
                  res.send({
                    success: false,
                    message: `Error: ${err.message}`,
                    setupBegan: true
                  });
                } else {
                  console.log(result);
                  var token = jwt.sign(
                    {
                      id: result._id,
                      role: result.role,
                      email: result.email,
                      is_active: result.is_active,
                      first_name: result.first_name,
                      last_name: result.last_name,
                      cus_id: result.cus_id,
                      sub_id: result.sub_id,
                      image: result.image,
                      password_reset:result.password_reset
                    },
                    config.secret,
                    {
                      expiresIn: 86400 // expires in 24 hours
                    }
                  );
                  if (subscriptions.status != "active") {
                    MongoClient.connect(URL, function(err, db) {
                      if (err) throw err;
                      collection.findOneAndUpdate(
                        { email: lowercase, password: passwordHash },
                        { $set: { is_active: false } }
                      );
                    });
                  }
                  db.close();
                  res.send({ auth: true, token: token });

                  //   res.send({
                  //   success: true,
                  //   message: `Stripe Subscription`,
                  //   setupBegan: true,
                  //   subscriptions
                  // });
                }
              }
            );
          } else {
            
            var token = jwt.sign(
              {
                id: result._id,
                role: result.role,
                email: result.email,
                is_active: result.is_active,
                first_name: result.first_name,
                last_name: result.last_name,
                cus_id: result.cus_id,
                sub_id: result.sub_id,
                image: result.image,
                password_reset:result.password_reset
              },
              config.secret,
              {
                expiresIn: 86400 // expires in 24 hours
              }
            );
            db.close();
            res.send({ auth: true, token: token });
          }
        } else {
          db.close();
          res.status(401).send({ error: "Incorrect Credentials" });
        }
      },
      err => {
        db.close();
        res.status(401).send({ error: err });
      }
    );
  });
});

function makeid() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

router.post("/reset_password", (req, res) => {
  var email = req.body.email;

  var token = makeid();
  var tokenHash = crypto
    .createHash("md5")
    .update(token)
    .digest("hex");

  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("users");
    collection
      .findOneAndUpdate({ email: email }, { $set: { password: tokenHash, password_reset:true } })
      .then(
        result => {
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
      <div style="color:#000;  font-size: 12pt; font-family: Arial; font-weight: bold; margin:10px 0px; display: inline-block">Password Reset</div>
      <div style=" font-size: 10pt; padding:15px;
      color:#808080;
      font-family:Arial;
      ">
        Here is your new password. To manage your subscription, please login to your account <a href="https://hollywood-id.com/">here</a>
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
            subject: "Your New Password!", // Subject line
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
        },
        err => {
          db.close();
          res.status(500).send({ message: "error burh" });
        }
      );
  });
});

router.post("/new_password", (req, res) => {
  
  var password = req.body.password;
  var id = req.body.id;


  var passwordHash = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");


  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("users");
    collection.findOneAndUpdate({ _id: ObjectId(id) }, {$set:{password: passwordHash, password_reset:false}}).then(
      result => {
        db.close();
        res.status(200).send({message:'success'})
      },
      err => {
        db.close();
        res.status(500).send({ message: "error burh" });
      }
    );
  });
});

router.post("/change_password", (req, res) => {
  var id = req.body.id;
  var password = req.body.password;
  var newPassword = req.body.newPassword;

  var passwordHash = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");

  var newPasswordHash = crypto
    .createHash("md5")
    .update(newPassword)
    .digest("hex");

  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("users");
    collection.findOne({ _id: ObjectId(id), password: passwordHash }).then(
      result => {
        if (result == null) {
          db.close();
          res.status(500).send({ message: "Current password was incorrect" });
        } else {
          if (newPassword.length < 6) {
            db.close();
            res
              .status(500)
              .send({ message: "Password Must be at least 6 characters" });
          } else {
            collection
              .update(
                { _id: ObjectId(id) },
                { $set: { password: newPasswordHash } }
              )
              .then(result2 => {
                db.close();
                res
                  .status(200)
                  .send({ message: "Password Successfully Changed." });
              });
          }
        }
      },
      err => {
        res.status(500).send({ message: "error burh" });
      }
    );
  });
});

router.post("/welcome", (req, res, next) => {
  var email = req.body.email;
  var sub = req.body.sub;
  var text = "";
  if (sub == "m") {
    text = "Your account will be billed monthly for $9.99.";
  } else {
    text = "Your account will be billed yearly for $99.99.";
  }

  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    port: 25,
    auth: {
      user: "dexhonsa@gmail.com",
      pass: "awesomeo21"
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
    <div style="color:#000;  font-size: 12pt; font-family: Arial; font-weight: bold; margin:10px 0px; display: inline-block">Welcome To The Hollywood Insider Directory</div>
    <div style=" font-size: 10pt; padding:15px;
    color:#808080;
    font-family:Arial;
    ">
      Thank you for joining The Hollywood Insider Directory! ${text}  To manage your subscription, please login to your account <a href="https://hollywood-id.com/">here</a>
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
    subject: "Thank you for Joining The Hollywood Insider Directory!", // Subject line
    text: "Hello world?", // plain text body
    html: emailOutputToUser // html body
  };

  transporter.sendMail(mailOptionsToUser, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("User sent: %s", info.messageId);
  });
  res.send({ message: "sent" });
});

router.patch("/edit/:id", (req, res, next) => {
  const options = req.body;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("users");
    collection
      .findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $set: options })
      .then(
        result => {
          db.close();
          res.status(200).send({ message: "success" });
        },
        err => {
          db.close();
          res.status(401).send({ message: "There was an Error" });
        }
      );
  });
});
router.post("/signup", (req, res, next) => {
  const {
    password,
    email,
    first_name,
    last_name,
    sub_id,
    cus_id,
    is_active
  } = req.body;
  lowerEmail = email.toLowerCase();
  var lowercase = email.toLowerCase();
  if (email.indexOf(" ") > -1) {
    res.status(401).send({ error: "emails cannot have spaces" });
    return;
  }
  if (password.length < 6) {
    res
      .status(401)
      .send({ error: "Passwords must have more than 6 characters" });
    return;
  }
  var passwordHash = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("users");
    collection.findOne({ email: lowercase }).then(result => {
      if (result == null) {
        collection
          .insert({
            email: lowercase,
            password: passwordHash,
            role: "normal",
            first_name,
            last_name,
            cus_id,
            sub_id,
            is_active,
            created_at: new Date()
          })
          .then(result => {
            db.close();
            res.send({
              userId: result.ops[0]["_id"],
              message: "Created Succesfully"
            });
          });
      } else {
        db.close();
        res.status(401).send({ error: "Email Exists" });
      }
    });
  });
});
router.get("/me", function(req, res) {
  var token = req.headers["authorization"];
  token = token.split(" ");
  if (!token[1])
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(token[1], config.secret, function(err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    res.status(200).send(decoded);
  });
});

module.exports = router;
