const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
require('dotenv').config();

// asdf

const app = express();
const port = process.env.PORT || 5555;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const uri = process.env.ATLAS_URI || 'mongodb+srv://user1:laQbWGwYJA2wluyK@cluster0.vxhabc2.mongodb.net/Workout_Planner?retryWrites=true&w=majority';
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

app.use('/exercises', exerciseRouter);
app.use('/workouts', workoutRouter);
app.use('/users', userRouter);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set("view engine", "ejs");

app.listen(port, () => {
console.log(`Server is running on port: ${port}`);
});
