const express = require("express");
 
// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const userRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
// This section will help you get a single record by id
userRoutes.route("/login").post(function (req, res) {
  console.log("/login triggered");

  let db_connect = dbo.getDb("Netflix");

  let myquery = { Email: req.body.email, Password:  req.body.password };
  console.log(myquery);
  db_connect
      .collection("User")
      .findOne(myquery, function (err, result) {
          if (err) {
            console.log(err) 
            return null;
          }
          console.log(result);

          if(result) {
            res.json(result);
          }
          else
          {
            return null;
          }
      });
});
 
// This section will help you update a record by id.
userRoutes.route("/update/:id").post(function (req, response) {
 let db_connect = dbo.getDb(); 
 let myquery = { _id: ObjectId( req.params.id )}; 
 let newvalues = {   
   $set: {     
     name: req.body.name,    
     position: req.body.position,     
     level: req.body.level,   
   }, 
  }
});
 
 
module.exports = userRoutes;