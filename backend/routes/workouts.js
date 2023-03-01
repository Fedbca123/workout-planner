const router = require('express').Router();
const fs = require('fs');
var multer = require('multer');
const upload = require('../middleware/uploadMiddleware');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);
var path = require('path');
const cloudinary = require('../cloudinary');
let { Workout, workoutSchema } = require('../models/workout.model');
const { User, userSchema } = require('../models/user.model');
const { Exercise, exerciseSchema } = require('../models/exercise.model');
const config = require("../config.js");
const mongoose = require('mongoose');

/*
Error Codes:
200 - OK
400 - general error (look at message for details)
401 - error retrieving workout(s)
402 - cloudinary image upload failed
403 - Failed to authenticate
495 - saving associated user failed
496 - error deleting workout
497 - error saving workout
498 - id provided does not exist in workout collection
499 - error when workout doc was being saved in DB
500 - error performing search on workouts
*/

//--------helper functions--------//
function removeItem(array, val){
  const index = array.indexOf(val);
  if(index > -1) {
    array.splice(index,1);
  }
  return array;
}

//------GET-----//

// Get all workouts
// (GET) http://(baseUrl)/workouts/
// returns [{ workouts }]
//! NEED TO SECURE THIS. NO LONGER SAFE IF ALL
//! USERS STORE PERSONAL STUFF IN THIS COLLECTION
router.route('/').get((req,res) => {
  Workout.find()
    .then(workouts => res.json(workouts))
    .catch(err => res.status(401).json('Error: ' + err));
});

// Get workout by id
// req.params = { workoutId }
// (GET) http://(baseUrl)/workouts/:id
// returns { workout }
//! SECURE THIS ENDPOINT SOME WAY OR WIPE IT OUT
router.route('/:id').get((req, res) => {
  Workout.findById(req.params.id)
    .then(workout => res.json(workout))
    .catch(err => res.status(401).json('Error: ' + err))
});

//-----POST-----//

// Create workout
// req.body = { title, description, exerciseIds, duration, location, tags, muscleGroups, owner }
// req.file = { image }
// (POST) http://(baseUrl)/workouts/add
// returns { newWorkout }
//! SECURE OR REMOVE. NEEDED FOR COLLECTION POPULATION
router.route('/add').post(upload.single('image'),async (req,res) => {
  // gather information to add workout into database
  const title = req.body.title;
  const description = req.body.description;

  var image = null;
  var imageId = null;
  if(req.file){
    await cloudinary.v2.uploader.upload(req.file.path,{folder: "workouts"},function(err, result) {
      if (err)
        return res.status(402).send({Error: err});
      image = result.url;
      imageId = result.public_id;
    });
  } else{
    // Defualt Cloudinary Workout Image, UPDATE IF CHANGED!!
    image = config.DEFAULTWORKIMAGE;
    imageId = config.DEFAULTWORKIMAGEID;
  }

  const exerciseIds = req.body.exerciseIds;
  const exercises = [];
  if (exerciseIds)
  {
    for (let i = 0; i < exerciseIds.length; i++)
    {
      exercises.push(await Exercise.findById(exerciseIds[i]));
    }
  }

  const duration = req.body.duration;
  const location = req.body.location;
  const muscleGroups = req.body.muscleGroups;
  const owner = req.body.owner;
  
  let tags = [];
  tags = tags.concat(req.body.tags)
  if (title)
    tags = tags.concat(title.split(' '));

  const newWorkout = new Workout({
    title,
    description,
    image,
    imageId,
    exercises,
    duration,
    location,
    tags,
    muscleGroups,
    owner
  })

  newWorkout.save()
    .then(async () => {
      if (newWorkout.owner) {
        let user = await User.findById(newWorkout.owner)
        user.customWorkouts.push(newWorkout._id);
        await user.save((err, newUser) => {
          if (err) return res.status(495).send(err);
        });
      }
      res.json(newWorkout);
    })
    .catch(async err => {
      if (newWorkout.imageId != config.DEFAULTWORKIMAGEID) 
      {
        await cloudinary.v2.uploader.destroy(newWorkout.imageId, function() {
          if (err)
            console.log("There was an error deleting the exercise Photo")
          else{
            console.log("Photo deleted");
          }
        });
      }
      res.status(497).send({Error: err})
    });

  if(req.file){
     await unlinkAsync(req.file.path);
  }
});

// Search workouts
// req.body = { searchStr, muscleGroupsSrch, equipmentSrch, ownerId }
// (GET) http://(baseUrl)/workouts/search
// returns [{ workouts }]
//! AUTHORIZE TO MAKE SURE THE REQUEST IS BY OWNER OF ID (?) 
router.route('/search').post(async (req, res) => {
  let {searchStr, muscleGroupsSrch, equipmentSrch, ownerId} = req.body;

  let filters = {};
  filters.$and = [{scheduledDate: {$exists: false}}];
  //!DOES THIS ALLOW FOR USERS TO RETURN ITEMS THAT ARE PUBLIC AND THEIR OWN?
  filters.$or = [{owner: {$exists: false}}];

  if (searchStr)
  {
    searchArr = searchStr.split(' ');
    console.log(searchStr);
    console.log(searchArr);
    filters.$and.push({tags: { $in: searchArr}});
  }

  if (muscleGroupsSrch)
    filters.$and.push({muscleGroups: {$in: muscleGroupsSrch}});

  if (equipmentSrch)
    filters.$and.push({tags: {$in: equipmentSrch}});

  if (ownerId) {
    filters.$or.push({owner: mongoose.Types.ObjectId(ownerId)});
  }

  Workout.find(filters)
  .then(workout => res.json(workout))
  .catch(err => res.status(500).json('Error: ' + err));
});

//------UPDATE-----//

// Update workout
// req.body = { title,description,img,exercises,location,recurrence,scheduledDate,
//            dateOfCompletion,owner }
// req.file = { image }
// (PATCH) http://(baseUrl)/workouts/:id
// returns { newWorkout }
//! NEED TO ADD JWT AUTH CHECK TO MAKE SURE THEY OWN THE OBJECT THEY ARE TRYING TO MOD
router.route('/:id').patch(upload.single('image'), async (req,res) => {
  const id = req.params.id;
  const {title,description,img,exercises,location,recurrence,scheduledDate,dateOfCompletion,owner} = req.body;

  const workout = await Workout.findById(id);
  if(!workout)
  {
    return res.status(498).send({Error: `Workout ${id} does not exist!`});
  }

  var image = null;
  var imageId = null;
  if(req.file){
    await cloudinary.v2.uploader.upload(req.file.path,{folder: "workouts"},function(err, result) {
      if (err)
        return res.status(401).send({Error: err});
      image = result.url;
      imageId = result.public_id;
      if (workout.imageId != config.DEFAULTWORKIMAGEID)
      {
        cloudinary.v2.uploader.destroy(workout.imageId, function(err, result) {
          if (err)
            console.log("There was an error deleting the workout Photo")
          else{
            console.log("Photo deleted");
          }
        });
      }
    });
  }

  if(title) {workout.title = title;}
  if(description) {workout.description = description;}
  if(image != null) {workout.image = image;}
  if(imageId != null) {workout.imageId = imageId;}
  if(exercises) {workout.exercises = exercises;}
  if(location) {workout.location = location;}
  if(recurrence) {workout.recurrence = recurrence;}
  if(scheduledDate) {workout.scheduledDate = scheduledDate;}
  if(dateOfCompletion) {workout.dateOfCompletion = dateOfCompletion;}

  await workout.save((err,newWorkout) => {
    if (err) return res.status(497).send(err);
    res.status(200).json(newWorkout);
  });
  if(req.file){
    await unlinkAsync(req.file.path);
 }
});

//------DELETE-----//

// Delete workout
// req.params { id }
// (DELETE) http://(baseUrl)/workouts/:id
// returns `Workout ${deletion.title} deleted!`
//! NEED TO ADD JWT AUTH CHECK TO MAKE SURE THEY OWN THE OBJECT THEY ARE TRYING TO DELETE
router.route('/:id').delete(async (req,res) => {
  const workout = await Workout.findById(req.params.id);
  if (workout.owner) {
    const user = await User.findById(workout.owner);
    user.customWorkouts = removeItem(user.customWorkouts, workout._id);
    await user.save((err, newUser) => {
      if (err) return res.status(495).send(err);
    });
  }

  if (workout.imageId != config.DEFAULTWORKIMAGEID)
  {
    await cloudinary.v2.uploader.destroy(workout.imageId, function(err, result) {
      if (err)
        console.log("There was an error deleting the workout Photo")
      else{
        console.log("Photo deleted");
      }
    });
  }
  
  Workout.findByIdAndDelete(req.params.id)
    .then(deletion => res.json(`Workout ${deletion.title} deleted!`))
    .catch(err => res.status(496).json('Error: ' + err));
});

module.exports = router;