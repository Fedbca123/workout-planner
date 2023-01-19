const router = require('express').Router();
let Exercise = require('../models/exercise.model');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
var path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const cloudinary = require('../cloudinary');

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
    console.log('no image exists in this upload. Maybe the team wants to have a default picture?');
  }

  const exerciseType = req.body.exerciseType;
  const sets = req.body.sets;
  const reps = req.body.reps;
  const time = req.body.time;
  const weight = req.body.weight;
  const restTime = req.body.restTime;
  const tags = req.body.tags;
  const muscleGroups = req.body.muscleGroups;

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
    muscleGroups
  })

  newExercise.save()
    .then(() => res.json(newExercise))
    .catch(err => res.status(502).send({Error: err}));

  if(req.file){
    await unlinkAsync(req.file.path);
  }
});

//------UPDATE-----//
router.route('/:id').patch(async (req,res) => {
  const id = req.params.id;
  const {title,description,img,exerciseType,sets,reps,time,weight,restTime, tags, muscleGroups} = req.body;
  
  const exercise = await Exercise.findById(id);
  if (!exercise)
  {
      return res.status(400).send({Error: `Exercise ${id} does not exist!`});
  }

  if(title) {exercise.title = title;}
  if(description) {exercise.description = description;}
  if(img) {exercise.img = img;}
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
});

//------DELETE-----//
router.route('/:id').delete(async (req,res) => {
  const exercise = await Exercise.findById(req.params.id);
  console.log(exercise)
  await cloudinary.v2.uploader.destroy(exercise.imageId, function(err, result) {
    if (err)
      console.log("There was an error deleting the exercise Photo")
    else{
      console.log("Photo deleted");
    }
  });
  Exercise.findByIdAndDelete(req.params.id)
    .then(deletion => res.json(`Exercise ${deletion.title} deleted!`))
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;