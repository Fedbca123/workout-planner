const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5555;

// using ejs as templating engine
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri,{
  useNewUrlParser: true, useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully w/ ", uri);
});

const exerciseRouter = require('./routes/exercises');
const workoutRouter = require('./routes/workouts');
const userRouter = require('./routes/users');
const healthcheckRouter = require('./routes/healthcheck');

app.use('/exercises', exerciseRouter);
app.use('/workouts', workoutRouter);
app.use('/users', userRouter);
app.use('/healthcheck', healthcheckRouter);

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set("view engine", "ejs");

app.listen(port, () => {
console.log(`Server is running on port: ${port}`);
});
