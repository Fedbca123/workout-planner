const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let {Workout, workoutSchema} = require('./workout.model');
let {Exercise, exerciseSchema} = require('./exercise.model');
let {CompletedWorkout, completedWorkoutSchema} = require('./completedWorkout.model');

var userSchema = new Schema({
    firstName:  {
        type: String,
        required: [true, "Please enter your first name"],
        unique: false,
        trim: true,
        minlength: 2
    },
    lastName:  {
        type: String,
        required: [true, "Please enter your last name"],
        unique: false,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: [true,"This email is already associated with an account"],
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [8, "Password must be atleast 8 characters long"]
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    friendRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    blockedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    scheduledWorkouts: [{
        type: Schema.Types.ObjectId,
        ref: 'Workout'
    }],
    completedWorkouts: [{
      type: Schema.Types.ObjectId,
      ref: 'CompletedWorkout'
    }],
    customWorkouts: [{
        type: Schema.Types.ObjectId,
        ref: 'Workout'
    }],
    customExercises: [{
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
    }],
    darkMode: {type: Boolean}
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = { User, userSchema };

