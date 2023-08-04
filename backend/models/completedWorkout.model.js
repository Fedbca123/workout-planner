const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let {Exercise, exerciseSchema} = require('./exercise.model');

var completedWorkoutSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    minlength: 2
  },
  description: {
    type: String,
    required: false,
    unique: false,
    trim: true
  },
  image: String,
  imageId: String,
  exercises: {
    type: [exerciseSchema],
    required: false,
  },
  duration: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  dateOfCompletion: {
    type: Date,
    required: false,
  },
  tags: {
    type: [String],
    required: false
  },
  muscleGroups: {
    type: [String],
    required: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});

const CompletedWorkout = mongoose.model('CompletedWorkout', completedWorkoutSchema);

module.exports = {CompletedWorkout, completedWorkoutSchema};