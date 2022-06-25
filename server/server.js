const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

app.use('/login', (req, res) => {
    res.send({
      token: 'test123'
    });
  });

app.get('/', (req, res) => {
    res.send('Hello World, from express');
});

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
  if (err) console.error(err);

  });
  console.log(`Server is running on port: ${port}`);
});