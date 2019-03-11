var express = require("express");
var app = express();
var path = require('path');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var router = express.Router();
var userRoutes = require("./routes/users");
var executiveRoutes = require("./routes/executives");
var dealRoutes = require('./routes/deals');
var ifpRoutes = require('./routes/ifp');
var authRoutes = require("./routes/auth");
var listingRoutes = require('./routes/listings');
var ratingRoutes = require('./routes/ratings');
var stripeRoutes = require('./routes/stripe');
var professionalRoutes = require('./routes/professionals');
var morgan = require("morgan");
var nodemailer = require('nodemailer');
// var smtpTransport = require("nodemailer-smtp-transport");
var imdb = require('imdb-api');
var axios = require('axios');

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/static', express.static(path.join(__dirname + '/uploads')));
app.use('/api/user_uploads', express.static(path.join(__dirname + '/user_uploads')));
app.use('/api/professionals', professionalRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/executives', executiveRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/ifp', ifpRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/api/get_credits', (req, res)=>{
  var name = req.query.name;

  axios.get(`https://api.themoviedb.org/3/search/person?query=${name}&api_key=852f55d6bb8246c27b18a4ef34f28de3`).then(res2=>{
    if(res2.data.results[0] != null){
      var id =  res2.data.results[0].id; 
      axios.get(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=852f55d6bb8246c27b18a4ef34f28de3`).then(result=>{
        var movieCredits = result.data;
        axios.get(`https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=852f55d6bb8246c27b18a4ef34f28de3`).then(result2=>{
        var tvCredits = result2.data;
        res.status(200).send({movie:movieCredits, tv:tvCredits})
    })
      })
      

    }else{
      res.status(500).send({message:'Error none found'});
    }
    
  })
})

app.get("/api/get_movie", (req,res)=>{
   var movie =  req.query.movie;
  imdb.get({name: movie}, {apiKey: '1dbe796d', timeout: 30000}).then(data=>{
    res.status(200).send(data)
  },err=>{
    res.status(500).send({message:"error"})
  })
  
})

app.post('/api/learnmore', (req,res,next)=>{
  var email = req.body.email;

  let transporter = nodemailer.createTransport({
        service:'gmail',
        secure:false,
        port:25,
        auth:{
          user:'dexhonsa@gmail.com',
          pass:'awesomeo21'
        },
        tls:{
          rejectUnauthorized:false
        }
  });
  const emailOutputToCB = `
  <div style="background:#f8f8f8; text-align: center; width:100%; padding:30px 15px;box-sizing: border-box;">
  <div style="max-width: 500px; width:100%; background:#fff; padding:15px; text-align: center;display: inline-block; border:solid 1px #eaeaea; border-radius: 3px;box-sizing: border-box;">
  <div style="">
    <img src="https://commonbrain.io/static/media/logo_color_with_line.6c4cc84d.png" alt="" height="100px">
  </div>
    <div style="color:#000;  font-size: 12pt; font-family: Arial; font-weight: bold; margin:10px 0px; display: inline-block">A User Wants to Checkout CommonBrain<sup>TM</sup></div>
    <div style=" font-size: 10pt;
    color:#808080;
    font-family:Arial;
    ">
      ${email}
    </div>
    
  </div><br>
  <div style="display: inline-block; font-size: 10pt;
    font-family:Arial; color:#AFAFAF; margin-top:15px">
      CommonBrain | 77900 Country Club Dr | Palm Desert, CA 92211
    </div>
    </div>
  `;
  const emailOutputToUser = `
  <div style="background:#f8f8f8; text-align: center; width:100%; padding:30px 15px;box-sizing: border-box;">
  <div style="max-width: 500px; width:100%; background:#fff; padding:15px; text-align: center;display: inline-block; border:solid 1px #eaeaea; border-radius: 3px;box-sizing: border-box;">
  <div style="">
    <img src="https://commonbrain.io/static/media/logo_color_with_line.6c4cc84d.png" alt="" height="100px">
  </div>
    <div style="color:#000;  font-size: 12pt; font-family: Arial; font-weight: bold; margin:10px 0px; display: inline-block">Welcome To CommonBrain<sup>TM</sup></div>
    <div style=" font-size: 10pt;
    color:#808080;
    font-family:Arial;
    ">
      Thank you for your interest in CommonBrain!  Someone will contact you shortly  
    </div>
    
  </div><br>
  <div style="display: inline-block; font-size: 10pt;
    font-family:Arial; color:#AFAFAF; margin-top:15px">
      CommonBrain | 77900 Country Club Dr | Palm Desert, CA 92211
    </div>
    </div>
  `;
  let mailOptions = {
    from: '"CommonBrain Support" <support@commonbrain.com>', // sender address
    to: 'dexhonsa@hotmail.com' , // list of receivers
    subject: "A User Wants To Checkout CB!", // Subject line
    text: "Hello world?", // plain text body
    html: emailOutputToCB // html body
  };
  let mailOptionsToUser = {
    from: '"CommonBrain Support" <support@commonbrain.com>', // sender address
    to: email, // list of receivers
    subject: "Thank you for your interest in CommonBrain!", // Subject line
    text: "Hello world?", // plain text body
    html: emailOutputToUser // html body
  };
  

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("CB sent: %s", info.messageId);
    
  });

  transporter.sendMail(mailOptionsToUser, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("User sent: %s", info.messageId);
    
  });
  res.send({message:'sent'})
})

app.use((req, res, next) => {
  const error = new Error("Not Found");
  res.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});




mongoose.connect(
  "mongodb://dexhonsa:Awesomeo21!@hid-shard-00-00-6vaxg.mongodb.net:27017,hid-shard-00-01-6vaxg.mongodb.net:27017,hid-shard-00-02-6vaxg.mongodb.net:27017/test?ssl=true&replicaSet=HID-shard-0&authSource=admin&retryWrites=true"
);

module.exports = app;
