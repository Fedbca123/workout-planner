const router = require('express').Router();
let { Exercise }= require('../models/exercise.model');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
var path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const cloudinary = require('../cloudinary');
const { User, userSchema } = require('../models/user.model');
const config = require("../config.js");

//--------helper functions--------//
function removeItem(array, val){
  const index = array.indexOf(val);
  if(index > -1) {
    array.splice(index,1);
  }
  return array;
}

//------GET-----//
router.route('/').get((req,res) => {
  Exercise.find()
    .then(exercises => res.json(exercises))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Exercise.findById(req.params.id)
    .then(exercise => res.json(exercise))
    .catch(err => res.status(400).json('Error: ' + err))
})

//-----POST-----//
router.route('/add').post(upload.single('image'),async (req,res) => {
  // gather information to add exercise into database
  const title = req.body.title;
  const description = req.body.description;

  var image = null;
  var imageId = null;
  if(req.file){
    await cloudinary.v2.uploader.upload(req.file.path,{folder: "exercises"},function(err, result) {
      if (err)
        return res.status(501).send({Error: err});
      image = result.url;
      imageId = result.public_id;
    });
  }else{
    // Defualt Cloudinary Exercise Image, UPDATE IF CHANGED!!
    image = config.DEFAULTEXIMAGE;
    imageId = config.DEFAULTEXIMAGEID;
  }

  const exerciseType = req.body.exerciseType;
  const sets = req.body.sets;
  const reps = req.body.reps;
  const time = req.body.time;
  const weight = req.body.weight;
  const restTime = req.body.restTime;
  const tags = req.body.tags;
  const muscleGroups = req.body.muscleGroups;
  const owner = req.body.owner;

  const newExercise = new Exercise({
    title,
    description,
    image,
    imageId,
    exerciseType,
    sets,
    reps,
    time,
    weight,
    restTime,
    tags,
    muscleGroups,
    owner
  })

  newExercise.save()
    .then(async () => {
      if (newExercise.owner) {
        let user = await User.findById(newExercise.owner)
        user.customExercises.push(newExercise._id);
        await user.save();
      }
      res.json(newExercise);
    })
    .catch(async (err) => {
      if (newExercise.imageId != config.DEFAULTEXIMAGEID) 
      {
        await cloudinary.v2.uploader.destroy(newExercise.imageId, function() {
          if (err)
            console.log("There was an error deleting the exercise Photo")
          else{
            console.log("Photo deleted");
          }
        });
      }
      res.status(502).send({Error: err})
    });

  if(req.file){
    await unlinkAsync(req.file.path);
  }
});

//------UPDATE-----//
router.route('/:id').patch(upload.single('image'), async (req,res) => {
  const id = req.params.id;
  const {title,description,img,exerciseType,sets,reps,time,weight,restTime, tags, muscleGroups, owner} = req.body;
  
  const exercise = await Exercise.findById(id);
  if (!exercise)
  {
      return res.status(400).send({Error: `Exercise ${id} does not exist!`});
  }

  var image = null;
  var imageId = null;
  if(req.file){
    await cloudinary.v2.uploader.upload(req.file.path,{folder: "exercises"},function(err, result) {
      if (err)
        return res.status(501).send({Error: err});
      image = result.url;
      imageId = result.public_id;
      if (exercise.imageId != config.DEFAULTEXIMAGEID)
      {
        cloudinary.v2.uploader.destroy(exercise.imageId, function(err, result) {
          if (err)
            console.log("There was an error deleting the exercise Photo")
          else{
            console.log("Photo deleted");
          }
        });
      }
    });
  }

  if(title) {exercise.title = title;}
  if(description) {exercise.description = description;}
  if(image != null) {exercise.image = image;}
  if(imageId != null) {exercise.imageId = imageId;}
  if(exerciseType) {exercise.exerciseType = exerciseType;}
  if(sets) {exercise.sets = sets;}
  if(reps) {exercise.reps = reps;}
  if(time) {exercise.time = time;}
  if(weight) {exercise.weight = weight;}
  if(restTime) {exercise.restTime = restTime;}
  if(tags) {exercise.tags = tags;}
  if(muscleGroups) {exercise.muscleGroups = muscleGroups;}

  await exercise.save((err, newExercise)=>{
    if (err) return res.status(400).send(err);
    res.status(200).json(newExercise);
  });

  if(req.file){
    await unlinkAsync(req.file.path);
  }
});

//------DELETE-----//
router.route('/:id').delete(async (req,res) => {
  const exercise = await Exercise.findById(req.params.id);
  if (exercise.owner) {
    const user = await User.findById(exercise.owner);
    user.customExercises = removeItem(user.customExercises, exercise._id);
    await user.save((err, newUser) => {
      if (err) return res.status(499).send(err);
    });
  }

  if (exercise.imageId != config.DEFAULTEXIMAGEID) 
  {
    await cloudinary.v2.uploader.destroy(exercise.imageId, function(err, result) {
      if (err)
        console.log("There was an error deleting the exercise Photo")
      else{
        console.log("Photo deleted");
      }
    });
  } 

  Exercise.findByIdAndDelete(req.params.id)
    .then(deletion => res.json(`Exercise ${deletion.title} deleted!`))
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;