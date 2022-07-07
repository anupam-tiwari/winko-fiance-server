const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');
require("dotenv").config();


const DBURL = process.env.DBURL;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRouter)

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(DBURL, connectionParams)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(`${err}`);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.send('hello world')
})


app.listen(process.env.PORT || 4000, () => console.log(`Started server`));
