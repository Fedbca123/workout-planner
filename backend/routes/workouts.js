const router = require('express').Router();
let {Workout, workoutSchema} = require('../models/workout.model');
const fs = require('fs');
var multer = require('multer');
const upload = require('../middleware/uploadMiddleware');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);
var path = require('path');
const cloudinary = require('../cloudinary');
const {User, userSchema} = require('../models/user.model');

//------GET-----//
router.route('/').get((req,res) => {
  Workout.find()
    .then(workouts => res.json(workouts))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Workout.findById(req.params.id)
    .then(workout => res.json(workout))
    .catch(err => res.status(400).json('Error: ' + err))
});

//-----POST-----//
router.route('/add').post(upload.single('image'),async (req,res) => {
  // gather information to add workout into database
  const title = req.body.title;
  const description = req.body.description;

  var image = null;
  var imageId = null;
  if(req.file){
    await cloudinary.v2.uploader.upload(req.file.path,{folder: "workouts"},function(err, result) {
      if (err)
        return res.status(501).send({Error: err});
      image = result.url;
      imageId = result.public_id;
    });
  }else{
    console.log('no image exists in this upload. Maybe the team wants to have a default picture?');
  }

  const recurrence = req.body.recurrence;
  const scheduledDate = req.body.scheduledDate;
  const dateOfCompletion = req.body.dateOfCompletion;
  const exercises = req.body.exercises;
  const duration = req.body.duration;
  const location = req.body.location;
  const tags = req.body.tags;
  const muscleGroups = req.body.muscleGroups;
  const owner = req.body.owner;

  const newWorkout = new Workout({
    title,
    description,
    image,
    imageId,
    exercises,
    duration,
    location,
    recurrence,
    scheduledDate,
    dateOfCompletion,
    tags,
    muscleGroups,
    owner
  })

  newWorkout.save()
    .then(() => {
      if (newWorkout.owner) {
        let user = User.findById(newWorkout.owner)
          .then(() => {
            user.customWorkouts.push(newWorkout._id);
          });
      }
      res.json(newWorkout);
    })
    .catch(err => res.status(502).send({Error: err}));

  if(req.file){
     await unlinkAsync(req.file.path);
  }
});

// router.route('/search').post(async (req, res) => {
//   const {searchStr, tags, muscleGroups} = req.body;

//   const results = Workout.find();

// })

//------UPDATE-----//
router.route('/:id').patch(upload.single('image'), async (req,res) => {
  const id = req.params.id;
  const {title,description,img,exercises,location,recurrence,scheduledDate,dateOfCompletion,owner} = req.body;

  const workout = await Workout.findById(id);
  if(!workout)
  {
    return res.status(400).send({Error: `Workout ${id} does not exist!`});
  }

  var image = null;
  var imageId = null;
  if(req.file){
    await cloudinary.v2.uploader.upload(req.file.path,{folder: "workouts"},function(err, result) {
      if (err)
        return res.status(501).send({Error: err});
      image = result.url;
      imageId = result.public_id;
      cloudinary.v2.uploader.destroy(workout.imageId, function(err, result) {
        if (err)
          console.log("There was an error deleting the workout Photo")
        else{
          console.log("Photo deleted");
        }
      });
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
  if(owner) {workout.owner = owner;}

  await workout.save((err,newWorkout) => {
    if (err) return res.status(400).send(err);
    res.status(200).json(newWorkout);
  });
  if(req.file){
    await unlinkAsync(req.file.path);
 }
});

//------DELETE-----//
router.route('/:id').delete(async (req,res) => {
  const workout = await Workout.findById(req.params.id);
  if (workout.owner) {
    const user = await User.findById(workout.owner);
    user.customWorkouts = removeItem(user.customWorkouts, workout._id);
    await user.save((err, newUser) => {
      if (err) return res.status(499).send(err);
    });
  }

  await cloudinary.v2.uploader.destroy(workout.imageId, function(err, result) {
    if (err)
      console.log("There was an error deleting the workout Photo")
    else{
      console.log("Photo deleted");
    }
  });
  Workout.findByIdAndDelete(req.params.id)
    .then(deletion => res.json(`Workout ${deletion.title} deleted!`))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;