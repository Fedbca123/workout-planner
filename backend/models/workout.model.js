const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let {Exercise, exerciseSchema} = require('./exercise.model');

var workoutSchema = new Schema({
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
  recurrence: {
    type: Boolean,
    required: false,
  },
  scheduledDate: {
    type: Date,
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

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = {Workout, workoutSchema};