const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var exerciseSchema = new Schema({
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
  exerciseType: {
    type: String,
    enum: ['AMRAP', 'CARDIO', 'SETSXREPS'],
  },
  sets:{
    type: Number,
    required: false,
    unique: false
  },
  reps: {
    type: Number,
    required: false,
    unique: false
  },
  time: {
    type: Number,
    required: false,
    unique: false
  },
  weight: {
    type: Number,
    required: false,
    unique: false
  },
  restTime:{
    type: Number,
    required: false,
    unique: false
  },
  tags: {
    type: [{type: String}],
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
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = {Exercise, exerciseSchema};