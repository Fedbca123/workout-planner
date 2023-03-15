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
const { EmailClient } = require("@azure/communication-email");

/* 
ADDING JWT TO YOUR AXIOS CALLS w/ Nestor :) :
1) import { useGlobalState } from "../../GlobalState.js";
2) set 'const [globalState, updateGlobalState] = useGlobalState(); ' in your component
3) when making a call do something along the lines of:
    API_instance.post(endpointPath,
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
492 - exercise id not found in DB
493 - email provided not in DB
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
505 - failed to send email
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
// (POST) API_Instance.post("users/register")
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
        toEncode = {user: user._id};
        const authToken = jwt.sign(toEncode, process.env.ACCESS_TOKEN_SECRET);
        user.password = null;

        return res.status(200).json({authToken, user: newUser});
    })
});

// Login user
// req.body = { email, password }
// (POST) API_Instance.post("users/login")
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
        // sign JWT for return
        toEncode = {_id: user._id};
        const authToken = jwt.sign(toEncode, process.env.ACCESS_TOKEN_SECRET);
        user.password = null;
        
        return res.status(200).json({authToken, user: user});
    }
    else 
    {
        return res.status(502).send({Error: "Invalid Credentials!"})
    }
});

//-----GET-----//

// Get user by id
// req.params = { id }
// (GET) API_Instance.delete("users/${id}")
// returns { Deleted: user.email }
router.route('/:id').get(authenticateToken, async (req, res) => {
  User.findById(req.params.id)
  .then(user => {
    user.password = null;
    res.json(user);
  })
  .catch(err => res.status(498).json('Error: ' + err))
});

//-----DELETE-----//

// Delete user by id
// req.params = { id }
// (DELETE) API_Instance.delete("users/${id}")
// returns { Deleted: user.email }
router.route('/:id').delete(authenticateToken, async (req, res) => {
    const id = req.params.id;

    if (req.user._id != id)
    {
      return res.sendStatus(403);
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user)
    {
        return res.status(498).send({Error: "User does not exist!"});
    }

    // for all workouts and Exercises with owner being id, delete the cloudinary image
    const workouts = await Workout.find({owner:id});
    const exercises = await Exercise.find({owner:id});

    for(const w of workouts){
      if (w.imageId != config.DEFAULTWORKIMAGEID)
      {
        await cloudinary.v2.uploader.destroy(w.imageId, function(err, result) {
          if (err)
            console.log("There was an error deleting the workout Photo")
          else{
            console.log("Photo deleted");
          }
        });
      }
    }

    for(const e of exercises){
      if (e.imageId != config.DEFAULTEXIMAGEID) 
      {
        await cloudinary.v2.uploader.destroy(e.imageId, function(err, result) {
          if (err)
            console.log("There was an error deleting the exercise Photo")
          else{
            console.log("Photo deleted");
          }
        });
      } 
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
// (PATCH) API_Instance.patch("users/{$id}/contact")
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
// (PATCH) API_Instance.post("users/{$id}/workouts/schedule")
// returns { newuser }
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
// (PATCH) API_Instance.patch("users/{$id}/workouts/remove/${w:id}")
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
// (PATCH) API_Instance.patch("users/{$id}/workouts/complete/${w:id}")
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

// user gets all their friends
// req.params = {id}
// (GET) API_Instance.get("users/{$id}/friends/all")
// returns { [ {friend Schemas but not encrypted password or friends} ] }
router.route('/:id/friends/all').get(authenticateToken, async(req,res)=>{
  const id = req.params.id;

  if (req.user._id != id)
  {
    return res.sendStatus(403);
  }

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: `User (${id}) does not exist!`});
  }

  const friends = [];

  for(const friendID of user.friends){
    const friend  = await User.findById(friendID);
    if (!friend) {
      return res.status(498).send({Error: `Friend ${friendID} does not exist!`});
    }

    friend.password = null;
    friend.friends = null;
    friend.friendRequests = null;
    friend.blockedUsers = null;

    friends.push(friend);
  }

  res.status(200).json({friends: friends});
});

// user gets all their friend requests
// req.params = {id}
// (GET) API_Instance.get("users/{$id}/invites/all")
// returns { [{user Schemas but not encrypted password or friends}] }
router.route('/:id/invites/all').get(authenticateToken, async (req,res)=>{
  const id = req.params.id;

  if (req.user._id != id)
  {
    return res.sendStatus(403);
  }

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: `User (${id}) does not exist!`});
  }

  const invites = [];

  for(const friendID of user.friendRequests){
    const friend  = await User.findById(friendID);
    if (!friend) {
      return res.status(498).send({Error: `Friend ${friendID} does not exist!`});
    }

    friend.password = null;
    friend.friends = null;
    friend.friendRequests = null;
    friend.blockedUsers = null;

    invites.push(friend);
  }

  res.status(200).json({friendInvites: invites});
});

// user gets all blocked users
// req.params = {id}
// (GET) API_Instance.get("users/{$id}/blocked/all")
// returns { [{user Schemas but not encrypted password or friends}] }
router.route('/:id/blocked/all').get(authenticateToken, async (req,res)=>{
  const id = req.params.id;

  if (req.user._id != id)
  {
    return res.sendStatus(403);
  }

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: `User (${id}) does not exist!`});
  }

  const blockedUsers = [];

  for(const userID of user.blockedUsers){
    const blockedUser = await User.findById(userID);
    if (!blockedUser) {
      return res.status(498).send({Error: `Friend ${userID} does not exist!`});
    }

    blockedUser.password = null;
    blockedUser.friends = null;
    blockedUser.friendRequests = null;
    blockedUser.blockedUsers = null;

    blockedUsers.push(blockedUser);
  }

  res.status(200).json({blockedUsers: blockedUsers});
});

// User A Sends friend request to user B
// req.params = {id}
// (POST) API_Instance.post("users/{$current_user_id}/invites/add")
// Body {email: user_B_Email}
// returns { newuserB }
router.route('/:id/invites/add').post(authenticateToken, async (req,res) => {
  const A_id = req.params.id;
  const friendEmail = req.body.email;

  if (req.user._id != A_id){
    return res.sendStatus(403);
  }

  const userA = await User.findById(A_id);
  if (!userA){
    return res.status(498).send({Error: `User (${A_id}) does not exist!`});
  }

  const userB = await User.findOne({email: friendEmail});
  if (!userB){
    return res.status(493).send({Error: `User with email ${friendEmail} does not exist!`});
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
// (PATCH) API_Instance.patch("users/{$current_user_id}/invites/accept/${accepted_user_id}")
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
// (PATCH) API_Instance.patch("users/{$current_user_id}/invites/reject/${rejected_user_id}")
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
// (PATCH) API_Instance.patch("users/{$current_user_id}/friends/remove/${friend_object_id}")
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
// (PATCH) API_Instance.patch("users/{$current_user_id}/blocked/add/${blocked_user_id}")
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
// (PATCH) API_Instance.patch("users/{$current_user_id}/blocked/remove/${blocked_user_id}")
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
// (Get) API_Instance.get("users/${id}/calendar/all")
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
});

// Get all custom workouts of user
// req.params = { userId }
// (Get) API_Instance.get("users/${id}/workouts/custom/all")
// returns { workouts: [{workouts}]}
router.route('/:id/workouts/custom/all').get(authenticateToken, async (req,res) => {
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
  // declaring array
  let workouts = [];
  // get all workout objects into array
  for(const workoutID of user.customWorkouts){
    const workout  = await Workout.findById(workoutID);
    if (!workout) {
      return res.status(494).send({Error: `Workout ${workoutID} does not exist!`});
    }

    workouts.push(workout);
  }

  res.status(200).json({
    workouts: workouts
  });
});

// Get all custom exercises of user
// req.params = { userId }
// (Get) API_Instance.get("users/${id}/exercises/custom/all")
// returns { exercises: [{exercises}]}
router.route('/:id/exercises/custom/all').get(authenticateToken, async (req,res) => {
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
  // declaring array
  let exercises = [];
  // get all workout objects into array
  for(const exerciseID of user.customExercises){
    const exercise  = await Exercise.findById(exerciseID);
    if (!exercise) {
      return res.status(492).send({Error: `Exercise ${exerciseID} does not exist!`});
    }

    exercises.push(exercise);
  }

  res.status(200).json({
    exercises: exercises
  });
});

// endpoint to send link to email verification endpoint
// body {firstName, lastName, email, password}
router.route('/emailVerification/send/to').post(async (req,res) => {
  // encrypt a JWT with the body passed in
  const {firstName, lastName, email, password} = req.body;

  const payload = {
    user:{
      firstName,
      lastName,
      email,
      password
    }
  }

  const authToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '35m'});

  const port = process.env.ENV === 'development' ? `${process.env.PORT}` : "";

  const endpointURI = `${process.env.API_URL}${port}/users/emailVerification/${authToken}`

  const message = `Thank you for registering with Workout Planner!\nBelow is the link required to verify your account and complete registration!\n\n${endpointURI}\n\nPlease note this link will expire in about 30 minutes. If it is not visited prior to expiring, you will need to re-complete the registration form found on the application.`;
  
  // send email to user
  try {
    var client = new EmailClient(process.env.EMAIL_CONNECTION_STRING);
    //send mail
    const emailMessage = {
      senderAddress: process.env.EMAIL_SENDER,
      content: {
        subject: "Verification Link for Workout Planner Account",
        plainText: message
      },
      recipients: {
        to: [
          {
            address: email,
          },
        ],
      },
    };
    var response = await client.beginSend(emailMessage);
  } catch (e) {
    console.log(e);
  }
});

// email verification endpoint
// once opened, register account stored in the jwt
router.route('/emailVerification/:JWT').get(async (req,res) => {
  const JWT = req.params.JWT;
  // decrypt the JWT passed in the URL
  jwt.verify(JWT, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) res.render('pages/verified', {title: "Unsuccessful Verification",message:"Looks like verification didn't go as smoothly this time. Try again from the mobile app."});//return res.sendStatus(406);
    const {firstName, lastName, email, password} = user.user;

    const emailExists = await User.findOne({email: {$regex: new RegExp("^" + email + "$", "i")}});
    
    if (emailExists)
    {
        res.render('pages/verified', {title: "Unsuccessful Verification", message:"Looks like verification didn't go as smoothly this time. Try again from the mobile app."});
        //return res.status(502).send({Error: "Email already exists!"}); 
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User ({
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

    await newUser.save((err, newUser) => {
      const title = err ? "Unsuccessful Verification" : "Your Account Has Been Verified!"
      const message = err ? "Looks like verification didn't go as smoothly this time. Try again from the mobile app." : `You are officially on your way to pursue your fitness goals through your account linked to ${newUser.email}. Login through the app to begin your journey!`;
      res.render('pages/verified', {title: title, message : message});
    })
  })
});

// endpoint to send link to email reset endpoint
// body {email}
router.route('/forgotpassword/email/send/to').post(async (req,res) => {
  // encrypt a JWT with the body passed in
  const {email} = req.body;

  const emailExists = await User.findOne({email: {$regex: new RegExp("^" + email + "$", "i")}});
  
  if(!emailExists){
    return res.status(502);
  }

  const payload = {
    email: email
  }

  const authToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '35m'});

  const port = process.env.ENV === 'development' ? `${process.env.PORT}` : "";

  const endpointURI = `${process.env.API_URL}${port}/users/forgotpassword/reset/${authToken}`

  const message = `Looks like you requested to reset your password.\n\nBelow is the link required to reset your account's password.\n\n${endpointURI}\n\nPlease note this link will expire in about 30 minutes. If it is not visited prior to expiring, you will need to repeat the process of requesting a password reset in our app.`;
  
  // send email to user
  try {
    var client = new EmailClient(process.env.EMAIL_CONNECTION_STRING);
    //send mail
    const emailMessage = {
      senderAddress: process.env.EMAIL_SENDER,
      content: {
        subject: "Workout Planner Password Reset",
        plainText: message
      },
      recipients: {
        to: [
          {
            address: email,
          },
        ],
      },
    };
    var response = await client.beginSend(emailMessage);
  } catch (e) {
    console.log(e);
    return res.status(505).json({message: "Email sent if email exists"});
  }

  return res.status(200);
});

router.route('/forgotpassword/reset/:JWT').get(async (req,res) => {
  const JWT = req.params.JWT;
  const message = "Please return to the Workout Planner mobile application to begin the process of resetting your password if you wish to continue.";

  // decrypt the JWT passed in the URL
  jwt.verify(JWT, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err){ 
      return res.render('pages/reset', {success: false, email:null ,title:"Invalid Request", message: message});
    }

    const email = user.email;
    
    // timeout when trying to find user...
    // once this is figured out, it should render the form
    const curUser = await User.findOne({email: {$regex: new RegExp("^" + email + "$", "i")}})
    .catch(e => {
      return res.render('pages/reset', {success: false, email:email ,title:"Invalid Request", message: message});
    });
    
    if (!curUser)
    {
      return res.render('pages/reset', {success: false, email:email ,title:"Invalid Request", message: message});
    }
    
    //new token
    const toEncode = {email: user.email};
    const authToken = jwt.sign(toEncode, process.env.ACCESS_TOKEN_SECRET);

    return res.render('pages/reset', {success: true, email:curUser.email ,title:"Password Reset Form", message: message, id: curUser._id, JWT: authToken});
  });
});

router.route('/forgotpassword/reset/:JWT').post(async (req,res) => {
  const JWT = req.params.JWT;
  // decrypt the JWT passed in the URL
  jwt.verify(JWT, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) res.render('pages/reset', {success: false, title:"Invalid Request", message: "Please return to the Workout Planner mobile application to begin the process of resetting your password if you wish to continue."});//return res.sendStatus(406);
    const email = user.email;

    const curUser = await User.findOne({email: {$regex: new RegExp("^" + email + "$", "i")}});
    if (!curUser)
    {
      return res.render('pages/reset', {success: false, title:"Invalid Request", message: "Please return to the Workout Planner mobile application to begin the process of resetting your password if you wish to continue."});
    }

    const {password} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    curUser.password = hashedPassword;

    await curUser.save((err, newUser) => {
      const title = err ? "Failed Reset of Password" : "Password Successfully Reset"
      const message = err ? "Looks like password reset didn't go as planned. Try starting the process again from the mobile app." : "Attempt a new login in the Workout Planner mobile app with your new password.";
      res.render('pages/reset', {success: false, title: title, message: message});  
    });
  })
});

// endpoint to send link to email verification endpoint for email reset
// body {firstName, lastName, email, password}
router.route('/emailreset/send/to').post(async (req,res) => {
  // encrypt a JWT with the body passed in
  const {firstName, lastName, email, password} = req.body;

  const payload = {
    user:{
      firstName,
      lastName,
      email,
      password
    }
  }

  const authToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '35m'});

  const port = process.env.ENV === 'development' ? `${process.env.PORT}` : "";

  const endpointURI = `${process.env.API_URL}${port}/users/emailreset/${authToken}`

  const message = `Hi ${firstName} ${lastName},\nThank you for pursuing your fitness goals with Workout Planner!\nBelow is the link required to verify ${email} as the new email related to your account!\n\n${endpointURI}\n\nPlease note this link will expire in about 30 minutes. If it is not visited prior to expiring, you will need to request an update of your email again from the settings page of the mobile application.`;
  
  // send email to user
  try {
    var client = new EmailClient(process.env.EMAIL_CONNECTION_STRING);
    //send mail
    const emailMessage = {
      senderAddress: process.env.EMAIL_SENDER,
      content: {
        subject: "Verification Link for New Workout Planner Email",
        plainText: message
      },
      recipients: {
        to: [
          {
            address: email,
          },
        ],
      },
    };
    var response = await client.beginSend(emailMessage);
  } catch (e) {
    console.log(e);
  }
});

// email verification endpoint
// once opened, register account stored in the jwt
router.route('/emailreset/:JWT').get(async (req,res) => {
  const JWT = req.params.JWT;
  // decrypt the JWT passed in the URL
  jwt.verify(JWT, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) res.render('pages/verified', {title: "Unsuccessful Verification",message:"Looks like verification didn't go as smoothly this time. Try again from the mobile app."});//return res.sendStatus(406);
    const {firstName, lastName, email, password} = user.user;

    const emailExists = await User.findOne({email: {$regex: new RegExp("^" + email + "$", "i")}});
    
    if (emailExists)
    {
        res.render('pages/verified', {title: "Unsuccessful Verification", message:"Looks like verification didn't go as smoothly this time. Try again from the mobile app."});
        //return res.status(502).send({Error: "Email already exists!"}); 
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User ({
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

    await newUser.save((err, newUser) => {
      const title = err ? "Unsuccessful Verification" : "Your New Email Has Been Verified!"
      const message = err ? "Looks like verification didn't go as smoothly this time. Try again from the mobile app." : `You can now proudly tell your friends your Workout Planner account email is ${newUser.email}. Login through the app to see it in action!`;
      res.render('pages/verified', {title: title, message : message});
    })
  })
});
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

/*
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
*/