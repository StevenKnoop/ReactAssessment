const express = require("express");

// tvShowRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const tvShowRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the records.
tvShowRoutes.route("/tvshow").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("records")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

tvShowRoutes.route("/tvshow/:user_id").get(function (req, res) {
  console.log("fired /tvshow/:user_id");
  console.log(req.params.user_id);
  let db_connect = dbo.getDb();
  let myquery = { user_id: req.params.user_id };
  db_connect
      .collection("TVShow")
      .find(myquery)
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
 });

// This section will help you create a new record.
tvShowRoutes.route("/tvshow/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    id: req.body.id,
    user_id: req.body.user_id
  };
  db_connect.collection("TVShow").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res); 
  });
});

// This section will help you delete a record
tvShowRoutes.route("tvshow/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("records").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = tvShowRoutes;