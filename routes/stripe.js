const express = require("express");
const router = express.Router();
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var CircularJSON = require("circular-json");
var ObjectId = require("mongodb").ObjectId;
var mkdirp = require("mkdirp");
var fs = require("fs-extra");
var crypto = require("crypto");
var stripe = require("stripe")("sk_test_CLIhgZyyAMDTGBheTNMRedfP");

var URL =
  "mongodb://dexhonsa:Awesomeo21!@hid-shard-00-00-6vaxg.mongodb.net:27017,hid-shard-00-01-6vaxg.mongodb.net:27017,hid-shard-00-02-6vaxg.mongodb.net:27017/test?ssl=true&replicaSet=HID-shard-0&authSource=admin&retryWrites=true";

router.post("/create_charge", (req, res, next) => {});

router.post("/setup_account", (req, res, next) => {
  var { email, plan, token } = req.body;
  const customer = stripe.customers
    .create({
      email,
      source:token.id
    })
    .then(customer => {
      
      if (plan == "y") {
        plan = {
          plan: "plan_EM5ZsMrmjgcPqi"
        };
      } else {
        plan = {
          plan: "plan_EM5ZBAKLENkNn6"
        };
      }
      stripe.subscriptions
        .create({
          customer: customer.id,
          items: [plan]
        })
        .then(
          sub => {
            res.send(sub);
          },
          err => {
            res.send(err);
          }
        );

      // stripe.customers.createSource(
      //   customer.id,
      //   { source: "tok_visa" },
      //   function(err, card) {
      //     // asynchronously called
      //   }
      // );
    });
});

router.post("/get_cus", (req, res, next) => {
  const cus_id = req.body.cus_id;
  
    stripe.customers.retrieve(cus_id, (err, cus) => {
      if (err) {
        res.send({
          success: false,
          message: `Error: ${err.message}`,
          setupBegan: true
        });
      }else{
        res.send({
        success: true,
        message: `Stripe Subscription`,
        setupBegan: true,
        cus
      });
      }

      
    });
  
});

router.post("/get_sub", (req, res, next) => {
  const subId = req.body.sub_id;
  console.log(subId);
    stripe.subscriptions.retrieve(subId, (err, subscriptions) => {
      if (err) {
        res.send({
          success: false,
          message: `Error: ${err.message}`,
          setupBegan: true
        });
      }else{
        res.send({
        success: true,
        message: `Stripe Subscription`,
        setupBegan: true,
        subscriptions
      });
      }

      
    });
  
});

router.post("/cancel_sub", (req, res, next) => {
  const subId = req.body.sub_id;

  stripe.subscriptions.update(subId, {cancel_at_period_end: true}, (err, subscription) =>{
    if(err){
      res.status(401).send({
        success:false,
        message:`Error ${err.message}`
      })
    }else{
      res.status(200).send({
        success:true,
        message: 'Success!'
      })
    }
  });
});

  router.post("/restart_sub", (req, res, next) => {
    const subId = req.body.sub_id;
  
    stripe.subscriptions.update(subId, {cancel_at_period_end: false}, (err, subscription) =>{
      if(err){
        res.status(401).send({
          success:false,
          message:`Error ${err.message}`
        })
      }else{
        res.status(200).send({
          success:true,
          message: 'Success!'
        })
      }
    });
  
    
  
});

router.post("/save_account", (req, res, next) => {
  const stripeAccountId = req.body.stripe_id;
  if (!stripeAccountId) {
    cb({
      success: false,
      message: "Missing stripe Account",
      setupBegan: false
    });
  } else {
    const {
      day,
      month,
      year,
      first_name,
      last_name,
      account_type,
      address,
      city,
      state,
      postal_code,
      ssn_last_4,
      token
    } = ctx.body;

    stripe.accounts
      .update(stripeAccountId, {
        external_account: token,
        legal_entity: {
          dob: {
            day,
            month,
            year
          },
          first_name,
          last_name,
          type: account_type,
          address: {
            line1: address,
            city,
            postal_code,
            state
          },
          ssn_last_4
        }
      })
      .then(
        result => {
          res.send(result);
        },
        err => {
          res.send(err);
        }
      );
  }
});

router.post("/update_card", (req, res)=>{
  const {cus_id, token} = req.body;
  
  
    stripe.customers.update(cus_id, {source: token.id}, (err, customer) =>{
      if(err){
        res.status(401).send({
          success:false,
          message:`Error ${err.message}`
        })
      }else{
        res.status(200).send({
          success:true,
          message: 'Success!',
          customer
        })
      }
    });
})

module.exports = router;
