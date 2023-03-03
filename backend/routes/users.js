require('dotenv').config();

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../cloudinary');
const upload = require('../middleware/uploadMiddleware');
const { User, userSchema } = require('../models/user.model');
const { Workout, workoutSchema} = require('../models/workout.model'); 
const { Exercise, exerciseSchema } = require('../models/exercise.model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken.js');

/* 
ADDING JWT TO YOUR AXIOS CALLS w/ Nestor :) :
1) import { useGlobalState } from "../../GlobalState.js";
2) set 'const [globalState, updateGlobalState] = useGlobalState(); ' in your component
3) when making a call do something along the lines of:
    axios.post(http://(baseUrl)/endpointPath,
      {body of the call},
      {headers: {
        'Content-Type': 'multipart/form-data',
        'authorization': `BEARER ${globalState.authToken}`
        }
      }
    );
*/

/*
Error Codes:
200 - OK
400 - general error (look at message for details)
401 - error retrieving user(s)
403 - Failed to authenticate
405 - No Token Provided
494 - workout id not found in db
495 - email not in proper format
496 - modification seeking to be made has already been made (look at message for details)
      (ie inviting the same user twice will fail the second time)
497 - user attempting call is blocked by other user
498 - id provided does not exist in user DB
499 - error when user doc was being saved in DB
500 - all fields not entered properly
501 - password not of 8 chars long
502 - email already exists
*/


//--------helper functions--------//
function removeItem(array, val){
  const index = array.indexOf(val);
  if(index > -1) {
    array.splice(index,1);
  }
  return array;
}

function removeItemByID(array, id) {
  const indexOfObject = array.findIndex((obj) => obj._id == id);
  if(indexOfObject > -1) {
    array.splice(indexOfObject,1);
  }
  return array;
}

//-----POST-----//

// Register user
// req.body = { firstName, lastName, email, password }
// (POST) http://(baseUrl)/users/register
// returns { newUser }
router.route('/register').post(async (req,res) =>
{
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
    {
        return res.status(500).send({Error: "Please enter all fields!"});
    }

    if (password.length < 8)
    {
        return res.status(501).send({Error: "Password must be atleast 8 characters!"});
    }
    // Check if user exists
    const emailExists = await User.findOne({email: {$regex: new RegExp("^" + email + "$", "i")}});
    
    if (emailExists)
    {
        return res.status(502).send({Error: "Email already exists!"});
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User ({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        friends: [],
        friendRequests: [],
        blockedUsers: [],
        scheduledWorkouts: [],
        completedWorkouts: [],
        customWorkouts: [],
        customExercises: [],
    });



    await user.save((err, newUser) => {
        if (err) return res.status(499).send(err);
        const authToken = jwt.sign(newUser.toObject(), process.env.ACCESS_TOKEN_SECRET);
        user.password = null;

        return res.status(200).json({authToken, user: newUser});
    })
});

// Login user
// req.body = { email, password }
// (POST) http://(baseUrl)/users/login
// returns { user: user, friends: [{ user.friends }] }
router.route('/login').post(async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password)
    {
        return res.status(500).send({Error: "Please enter all fields!"});
    }

    // Check if user exists
    const user = await User.findOne({email: {$regex: new RegExp("^" + email + "$", "i")}});

    if (!user)
    {
        return res.status(501).send({Error: "Email does not exist!"});
    }

    if (await bcrypt.compare(password, user.password))
    {
        var friends = [];

        for (const friendID of user.friends) {
          await User.findById(friendID)
            .then(friend => friends.push(friend))
            .catch(err => res.status(400).json({Error: err}))
        }
        const authToken = jwt.sign(user.toObject(), process.env.ACCESS_TOKEN_SECRET);

        user.friends = friends;
        user.password = null;
        
        return res.status(200).json({authToken, user: user});
    }
    else 
    {
        return res.status(502).send({Error: "Invalid Credentials!"})
    }
});

//-----GET-----//

//-----DELETE-----//

// Delete user by id
// req.params = { id }
// (DELETE) http://(baseUrl)/users/:id
// returns { Deleted: user.email }
router.route('/:id').delete(authenticateToken, async (req, res) => {
    const id = req.params.id;

    if (req.user._id != id)
    {
      return res.sendStatus(403);
    }

    await Workout.deleteMany({owner: id});
    await Exercise.deleteMany({owner: id});

    User.findByIdAndDelete(id, function (error, body) {
        if (error)
        {
            return res.status(400).send(error);
        }
        else if (body)
        {
            return res.status(200).send({Deleted: body.email})
        }
        else
        {
            return res.status(498).send({Error: "Cannot be deleted because ID does not exist"})
        }
    })
});

//------UPDATE-----//

// Update contact info ( firstName, lastName, and email)
// req.params = { id }
// req.body = { firstName, lastName, email }
// (PATCH) http://(baseUrl)/users/:id/contact
// returns { newuser }
router.route('/:id/contact').patch(authenticateToken, async (req, res) => {
  const id = req.params.id;

  if (req.user._id != id)
  {
    return res.sendStatus(403);
  }

  const {firstName, lastName,email} = req.body

  // Check if user exists
  const user = await User.findById(id);
  if (!user)
  {
      return res.status(498).send({Error: "User does not exist!"});
  }

  if (firstName) {user.firstName = firstName;}
  if (lastName) {user.lastName = lastName;}
  if (email) {
    // make sure email field matches a regex
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      return res.status(495).send({Error: `${email} not in proper email format`});
    }
    // Check if email exists in DB
    const emailExists = await User.findOne({email: {$regex: new RegExp("^" + email + "$", "i")}});
    if (emailExists)
    {
      return res.status(502).send({Error: "Email already exists!"});
    }

    user.email = email;
  }

  await user.save((err, newUser) => {
      if (err) return res.status(499).send(err);
      res.status(200).json(newUser);
  });
});

// Schedule a workout
// req.params = { userId }
// req.body = { workoutId, date }
// (PATCH) http://(baseUrl)/users/:id/workouts/schedule
// returns { newuser }

// do we need a scheduling endpoint for one that is just being made?

router.route('/:id/workouts/schedule').post(authenticateToken,async (req,res) => {
  const id = req.params.id;

  if (req.user._id != id)
  {
    return res.sendStatus(403);
  }

  const workoutId = req.body.workoutID;
  const dateString = req.body.date;

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }

  const workout = await Workout.findById(workoutId);
  if (!workout){
    return res.status(498).send({Error: "Workout does not exist!"});
  }

  var workoutDate;
  if(dateString){
    // format of date in body "YYYY/MM/DD EST"
    workoutDate = new Date(dateString);
  }else if(workout.scheduledDate){
    workoutDate = workout.scheduledDate;
  }

  const newWorkout = new Workout({
    title: workout.title,
    description: workout.description,
    image: workout.image,
    imageId: workout.imageId,
    exercises: workout.exercises,
    duration: workout.duration,
    location: workout.location,
    tags: workout.tags,
    muscleGroups: workout.muscleGroups,
    owner: workout.owner,
    scheduledDate: workoutDate
  })

  await newWorkout.save()
  .then(async () => {
    user.scheduledWorkouts.push(newWorkout._id);
  })
  
  await user.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
});

// Remove a scheduled workout
// req.params = { userId, workoutId }
// (PATCH) http://(baseUrl)/users/:id/workouts/remove/w:id
// returns { newuser }
router.route('/:id/workouts/remove/:w_id').patch(authenticateToken,async (req,res) => {
  const {id, w_id} = req.params;

  if (req.user._id != id)
  {
    return res.sendStatus(403);
  }

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }

  // grab workout from body
  //const workout = req.body.workout;

  // remove workout from user's scheduledWorkouts section
  user.scheduledWorkouts = removeItem(user.scheduledWorkouts, w_id);
  Workout.findByIdAndDelete(w_id)
    .catch(err => res.status(400).json('Error: ' + err));

  await user.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
});


// Complete a workout
// req.params = { userId }
// req.body = { workoutId }
// (PATCH) http://(baseUrl)/users/:id/workouts/complete
// returns { newuser }
router.route('/:id/workouts/complete/:w_id').patch(authenticateToken,async (req,res) => {
  const id = req.params.id;
  const w_id = req.params.w_id;

  if (req.user._id != id)
  {
    return res.sendStatus(403);
  }

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }

  const workout = await Workout.findById(w_id);

  // if recurring add in again but a week in advance
  if(workout.recurrence){
    var date = workout.scheduledDate ? new Date(workout.scheduledDate) : new Date();
    date.setDate(date.getDate() + 7);
    workout.scheduledDate = date;
    await workout.save();
  } else {
    Workout.findByIdAndDelete(w_id)
    .catch(err => res.status(400).json('Error: ' + err));
    user.scheduledWorkouts = removeItem(user.scheduledWorkouts, w_id);
  }
  workout.recurrence = false;
  workout.dateOfCompletion = new Date();
  user.completedWorkouts.push(workout);

  await user.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });

});

// User A Sends friend request to user B
// req.params = { userId_A, userId_B }
// (PATCH) http://(baseUrl)/users/:A_id/invites/add/:B_id
// returns { newuserB }
router.route('/:A_id/invites/add/:B_id').patch(authenticateToken, async (req,res) => {
  // get id's from url
  const {A_id, B_id} = req.params;

  if (req.user._id != A_id)
  {
    return res.sendStatus(403);
  }

  // ensure users exist w/ ids
  const userA = await User.findById(A_id);
  if (!userA)
  {
    return res.status(498).send({Error: `User (${A_id}) does not exist!`});
  }
  const userB = await User.findById(B_id);
  if (!userB)
  {
    return res.status(498).send({Error: `User (${B_id}) does not exist!`});
  }

  // if userB has userA blocked, it won't go through
  if(userB.blockedUsers.includes(userA._id)) {
    return res.status(497).send("Blocked user");
  }
  // if already friends, won't do anything
  if(userB.friends.includes(userA._id)) {
    return res.status(496).send("Already friends");
  }
  // if already requested, don't do it again
  if(userB.friendRequests.includes(userA._id)) {
    return res.status(496).send("Already requested");
  }

  // add user A as a FR in B's list of FRs
  userB.friendRequests.push(userA._id);

  // save updated version of userB
  await userB.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
});

// User A accepts friend request form user B
// req.params = { userId_A, userId_B }
// (PATCH) http://(baseUrl)/users/:A_id/invites/accept/:B_id
// returns { message: `${userA.firstName} and ${userB.firstName} are friends` }
router.route('/:A_id/invites/accept/:B_id').patch(authenticateToken, async (req,res) => {
  // get id's from url
  const {A_id, B_id} = req.params;

  if (req.user._id != A_id)
  {
    return res.sendStatus(403);
  }

  // ensure users exist w/ ids
  const userA = await User.findById(A_id);
  if (!userA)
  {
    return res.status(498).send({Error: `User (${A_id}) does not exist!`});
  }
  const userB = await User.findById(B_id);
  if (!userB)
  {
    return res.status(498).send({Error: `User (${B_id}) does not exist!`});
  }

  if(!userA.friendRequests.includes(B_id)){
    return res.status(400).send({Error: `${userB.firstName} ${userB.lastName} is not in ${userA.firstName}'s invites list`})
  }

  // remove B from A's friend request list
  userA.friendRequests = removeItem(userA.friendRequests,userB._id);
  // add them to each other's friends list
  userA.friends.push(userB._id);
  userB.friends.push(userA._id);

  // save updated version of users
  await userA.save((err, newUser) => {
    if (err) return res.status(499).send(err);
  });
  await userB.save((err, newUser) => {
    if (err) return res.status(499).send(err);
  });

  // report success
  res.status(200).json({message: `${userA.firstName} and ${userB.firstName} are friends`});
});

// User A rejects friend request from user B
// req.params = { userId_A, userId_B }
// (PATCH) http://(baseUrl)/users/:A_id/invites/reject/:B_id
// returns { newuserA }
router.route('/:A_id/invites/reject/:B_id').patch(authenticateToken, async (req,res) => {
  // get id's from url
  const {A_id, B_id} = req.params;

  if (req.user._id != A_id)
  {
    return res.sendStatus(403);
  }

  // ensure users exist w/ ids
  const userA = await User.findById(A_id);
  if (!userA)
  {
    return res.status(498).send({Error: `User (${A_id}) does not exist!`});
  }
  const userB = await User.findById(B_id);
  if (!userB)
  {
    return res.status(498).send({Error: `User (${B_id}) does not exist!`});
  }

  // remove B from A's friend request list
  userA.friendRequests = removeItem(userA.friendRequests,userB._id);

  // save updated version of users
  await userA.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
});

// User A removes friend user B
// req.params = { userId_A, userId_B }
// (PATCH) http://(baseUrl)/users/:A_id/friends/remove/:B_id
// returns { message: `${userA.firstName} and ${userB.firstName} are no longer friends` }
router.route('/:A_id/friends/remove/:B_id').patch(authenticateToken, async (req,res) => {
  // get id's from url
  const {A_id, B_id} = req.params;

  if (req.user._id != A_id)
  {
    return res.sendStatus(403);
  }

  // ensure users exist w/ ids
  const userA = await User.findById(A_id);
  if (!userA)
  {
    return res.status(498).send({Error: `User (${A_id}) does not exist!`});
  }
  const userB = await User.findById(B_id);
  if (!userB)
  {
    return res.status(498).send({Error: `User (${B_id}) does not exist!`});
  }

  // remove from each other's lists
  userA.friends = removeItem(userA.friends, userB._id);
  userB.friends = removeItem(userB.friends, userA._id);

  // save updated version of users
  await userA.save((err, newUser) => {
    if (err) return res.status(499).send(err);
  });
  await userB.save((err, newUser) => {
    if (err) return res.status(499).send(err);
  });

  // report success
  res.status(200).json({message: `${userA.firstName} and ${userB.firstName} are no longer friends`});
});

// User A blocks user B
// req.params = { userId_A, userId_B }
// (PATCH) http://(baseUrl)/users/:A_id/blocked/add/:B_id
// returns { newuserA }
router.route('/:A_id/blocked/add/:B_id').patch(authenticateToken, async (req,res) => {
  // get id's from url
  const {A_id, B_id} = req.params;

  if (req.user._id != A_id)
  {
    return res.sendStatus(403);
  }

  // ensure users exist w/ ids
  const userA = await User.findById(A_id);
  if (!userA)
  {
    return res.status(498).send({Error: `User (${A_id}) does not exist!`});
  }
  const userB = await User.findById(B_id);
  if (!userB)
  {
    return res.status(498).send({Error: `User (${B_id}) does not exist!`});
  }

  // if already blocked, no need to do it again
  if(userA.blockedUsers.includes(userB._id)) {
    return res.status(497).send(`Already blocked ${userB._id}`);
  }

  // make sure friends doesn't include B
  userA.friends = removeItem(userA.friends, userB._id);
  // make sure friendrequests doesn't include B
  userA.friendRequests = removeItem(userA.friendRequests, userB._id);
  // add B as a blocked user on A's account
  userA.blockedUsers.push(userB._id);

  // save updated version of userA
  await userA.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
});

// User A unblocks user B
// req.params = { userId_A, userId_B }
// (PATCH) http://(baseUrl)/users/:A_id/blocked/remove/:B_id
// returns { newuserA }
router.route('/:A_id/blocked/remove/:B_id').patch(authenticateToken, async (req,res) => {
  // get id's from url
  const {A_id, B_id} = req.params;

  if (req.user._id != A_id)
  {
    return res.sendStatus(403);
  }

  // ensure users exist w/ ids
  const userA = await User.findById(A_id);
  if (!userA)
  {
    return res.status(498).send({Error: `User (${A_id}) does not exist!`});
  }
  const userB = await User.findById(B_id);
  if (!userB)
  {
    return res.status(498).send({Error: `User (${B_id}) does not exist!`});
  }

  // remove B as a blocked user on A's account
  userA.blockedUsers = removeItem(userA.blockedUsers, userB._id);

  // save updated version of userA
  await userA.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
});

// Get all scheduled workouts of user and friends nicely
// req.params = { userId }
// (PATCH) http://(baseUrl)/users/:id/calendar/all
// returns { completed: [{workouts }], scheduled: [{ workouts }]}
router.route('/:id/calendar/all').get(authenticateToken, async (req,res) => {
  const id = req.params.id;

  if (req.user._id != id)
  {
    return res.sendStatus(403);
  }

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }
  // declaring arrays
  let users = [];
  users.push(user);
  let completed = [];
  let scheduled = [];
  // get all user objects into array
  for(const friendID of user.friends){
    const friend  = await User.findById(friendID);
    if (!friend) {
      return res.status(498).send({Error: `Friend ${friendID} does not exist!`});
    }

    users.push(friend);
  }
  // for all workouts in all user objects, add to returning array
  for(const userObj of users){
    // for all scheduled workouts
    for(const workoutID of userObj.scheduledWorkouts){
      const workoutObj = await Workout.findById(workoutID);
      
      if (!workoutObj) {
        return res.status(494).send({Error: `Workout ${workoutID} does not exist!`});
      }

      const workout = {
        title: workoutObj.title,
        description: workoutObj.description,
        image: workoutObj.image,
        imageID: workoutObj.imageID,
        exercises: workoutObj.exercises,
        duration: workoutObj.duration,
        location: workoutObj.location,
        recurrence: workoutObj.recurrence,
        scheduledDate: workoutObj.scheduledDate,
        ownerName: userObj.firstName + " " + userObj.lastName,
        ownerEmail: userObj.email
      }

      scheduled.push(workout);
    }
    // for all completed workouts
    for(const workoutObj of userObj.completedWorkouts){
      const workout = {
        title: workoutObj.title,
        description: workoutObj.description,
        image: workoutObj.image,
        imageID: workoutObj.imageID,
        exercises: workoutObj.exercises,
        duration: workoutObj.duration,
        location: workoutObj.location,
        recurrence: workoutObj.recurrence,
        dateOfCompletion: workoutObj.dateOfCompletion,
        ownerName: userObj.firstName + " " + userObj.lastName,
        ownerEmail: userObj.email
      }

      completed.push(workout);
    }
  }

  const workouts = [...completed, ...scheduled];

  res.status(200).json({
    workouts: workouts
  });
})

// TO-DO Password reset
// not sure what to throw into this endpoint to complete this.
// still need to get to anyways

module.exports = router;


/* ----- GRAVEYARD ------ */
/*          X X           */
/*           O            */
/*

// Update user by id (Use Update contact info instead!)
// req.params = { id }
// req.body = {firstName, lastName,friends, friendRequests, blockedUsers, scheduledWorkouts,
//            completedWorkouts, customWorkouts, customExercises}
// (PATCH) http://(baseUrl)/users/:id
// returns { newUser }

//  !!  NEEDS JWT AUTHORIZATION REMEMBER TO COMPARE TO ID SO ITS SAME USER !!
router.route('/:id').patch(async (req, res) => {
    const id = req.params.id;
    
    const {firstName, lastName,friends, friendRequests, blockedUsers, scheduledWorkouts, completedWorkouts, customWorkouts, customExercises} = req.body

    // Check if user exists
    const user = await User.findById(id);
    if (!user)
    {
        return res.status(498).send({Error: "User does not exist!"});
    }

    if (firstName) {user.firstName = firstName;}
    if (lastName) {user.lastName = lastName;}
    if (friends) {user.friends = friends;}
    if (friendRequests) {user.friendRequests = friendRequests;}
    if (blockedUsers) {user.blockedUsers = blockedUsers;}
    if (scheduledWorkouts) {user.scheduledWorkouts = scheduledWorkouts;}
    if (completedWorkouts) {user.completedWorkouts = completedWorkouts;}
    if (customWorkouts) {user.customWorkouts = customWorkouts;}
    if (customExercises) {user.customExercises = customExercises;}
    
    await user.save((err, newUser) => {
        if (err) return res.status(499).send(err);
        res.status(200).json(newUser);
    });
});

// Get user by id
// req.params = { id }
// (GET) http://(baseUrl)/users/:id
// returns { user }

//  !!  NEEDS TO SECURE THIS FROM ANYONE BEING ABLE TO CALL IT !!
router.route('/:id').get(async (req, res) => {
    User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(401).json('Error: ' + err))
});

// Get all users
// (GET) http://(baseUrl)/users/
// returns [{ users }]

//  !!  NEED TO HANDLE IN SECURE WAY TO MAKE SURE ALMOST NO ONE CAN ACCESS THIS OR REMOVE IT !!
router.route('/').get(async (req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(401).json('Error: ' + err));
});

// adding custom exercise
// router.route('/:id/exercises/custom/create').post(async (req,res) => {
//   const id = req.params.id;

//   const user = await User.findById(id);
//   if (!user)
//   {
//     return res.status(498).send({Error: "User does not exist!"});
//   }

//   // exercise mostly in body but image in upload
//   const exercise = req.body.exercise;

//   // add workout to user's scheduledWorkouts section
//   user.customExercises.push(exercise);

//   await user.save((err, newUser) => {
//     if (err) return res.status(499).send(err);
//     res.status(200).json(newUser);
//   });
// });

// removing custom exercise

// router.route('/:id/exercises/custom/remove/:e_id').patch(async (req,res) => {
//   const {id, e_id} = req.params;

//   const user = await User.findById(id);
//   if (!user)
//   {
//     return res.status(498).send({Error: "User does not exist!"});
//   }

//   // remove workout from user's scheduledWorkouts section
//   user.customExercises = removeItemByID(user.customExercises, e_id);

//   await user.save((err, newUser) => {
//     if (err) return res.status(499).send(err);
//     res.status(200).json(newUser);
//   });
// });

// // editing custom exercise
// router.route('/:id/workouts/custom/edit/:e_id').patch(async (req,res)=> {
//   const {id, e_id} = req.params;
//   const {title, description, exerciseType, sets, reps, time, weight, restTime, tags, muscleGroups} = req.body;

//   const user = await User.findById(id);
//   if (!user)
//   {
//     return res.status(498).send({Error: "User does not exist!"});
//   }

//   for(const exercise of user.customExercises){
//     if(exercise._id == e_id){
//       if(title) {workout.title = title;}
//       if(description) {workout.description = description;}
//       if(exerciseType) {workout.exerciseType = exerciseType;}
//       if(sets) {workout.sets = sets;}
//       if(reps) {workout.reps = reps;}
//       if(time) {workout.time = time;}
//       if(weight) {workout.weight = weight;}
//       if(restTime) {workout.restTime = restTime;}
//       if(tags) {workout.tags = tags;}
//       if(muscleGroups) {workout.muscleGroups = muscleGroups;}
//     }
//   }

//   await user.save((err, newUser) => {
//     if (err) return res.status(499).send(err);
//     res.status(200).json(newUser);
//   });
// })

// // adding custom workout
// router.route('/:id/workouts/custom/schedule').post(async (req,res) => {
//   const id = req.params.id;

//   const user = await User.findById(id);
//   if (!user)
//   {
//     return res.status(498).send({Error: "User does not exist!"});
//   }

//   // grab workout from body
//   // may need to modify data depending on how it looks
//   // also to fulfill the schema we have defined
//   const workout = req.body.workout;

//   // add workout to user's scheduledWorkouts section
//   user.scheduledWorkouts.push(workout);

//   workout.recurrence = false;
//   workout.scheduledDate = null;
//   user.customWorkouts.push(workout);

//   await user.save((err, newUser) => {
//     if (err) return res.status(499).send(err);
//     res.status(200).json(newUser);
//   });
// });

// // remove custom workout from user's account
// router.route('/:id/workouts/custom/remove/:w_id').patch(async (req,res) => {
//   const {id, w_id} = req.params;

//   const user = await User.findById(id);
//   if (!user)
//   {
//     return res.status(498).send({Error: "User does not exist!"});
//   }

//   // grab workout from body
//   //const workout = req.body.workout;

//   // remove workout from user's scheduledWorkouts section
//   user.customWorkouts = removeItemByID(user.customWorkouts, w_id);

//   await user.save((err, newUser) => {
//     if (err) return res.status(499).send(err);
//     res.status(200).json(newUser);
//   });
// });

// // edit custom workout
// router.route('/:id/workouts/custom/edit/:w_id').patch(async (req,res)=> {
//   const {id, w_id} = req.params;
//   const {title, description, exercises, duration, location, scheduledDate, dateOfCompletion, tags, muscleGroups} = req.body;

//   const user = await User.findById(id);
//   if (!user)
//   {
//     return res.status(498).send({Error: "User does not exist!"});
//   }

//   for(const workout of user.customWorkouts){
//     if(workout._id == w_id){
//       if(title) {workout.title = title;}
//       if(description) {workout.description = description;}
//       if(exercises) {workout.exercises = exercises;}
//       if(duration) {workout.duration = duration;}
//       if(location) {workout.location = location;}
//       if(scheduledDate) {workout.scheduledDate = scheduledDate;}
//       if(dateOfCompletion) {workout.dateOfCompletion = dateOfCompletion;}
//       if(tags) {workout.tags = tags;}
//       if(muscleGroups) {workout.muscleGroups = muscleGroups;}
//     }
//   }

//   await user.save((err, newUser) => {
//     if (err) return res.status(499).send(err);
//     res.status(200).json(newUser);
//   });
// })
// edit scheduled workout from user's account
// router.route('/:id/workouts/edit/:w_id').patch(async (req,res) => {
//   const {id, w_id} = req.params;
//   const {title, description, exercises, duration, location, scheduledDate, dateOfCompletion, tags, muscleGroups, recurrence} = req.body;

//   const user = await User.findById(id);
//   if (!user)
//   {
//     return res.status(498).send({Error: "User does not exist!"});
//   }

//   for(const workout of user.customWorkouts){
//     if(workout._id == w_id){
//       if(title) {workout.title = title;}
//       if(description) {workout.description = description;}
//       if(exercises) {workout.exercises = exercises;}
//       if(duration) {workout.duration = duration;}
//       if(location) {workout.location = location;}
//       if(scheduledDate) {workout.scheduledDate = scheduledDate;}
//       if(dateOfCompletion) {workout.dateOfCompletion = dateOfCompletion;}
//       if(tags) {workout.tags = tags;}
//       if(muscleGroups) {workout.muscleGroups = muscleGroups;}
//       if(recurrence) {workout.recurrence = recurrence;}
//     }
//   }

//   await user.save((err, newUser) => {
//     if (err) return res.status(499).send(err);
//     res.status(200).json(newUser);
//   });
// }); */