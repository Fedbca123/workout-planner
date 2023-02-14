const router = require('express').Router();
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

let User = require('../models/user.model');

/*
Error Codes:
200 - OK
400 - general error (look at message for details)
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
        res.status(200).json(newUser);
    })
});

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

        // object ret is returned in JSON format
        return res.status(200).json({user: user, friends: friends});
    }
    else 
    {
        return res.status(502).send({Error: "Invalid Credentials!"})
    }
});

//-----GET-----//
router.route('/').get(async (req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get(async (req, res) => {
    User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err))
});

//-----DELETE-----//
router.route('/:id').delete((req, res) => {
    const id = req.params.id;
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

// update user contact info like firstName, lastName, and email
router.route('/:id/contact').patch(async (req, res) => {
  const id = req.params.id;
  
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

// adding custom exercise
router.route('/:id/exercises/custom/create').post(async (req,res) => {
  const id = req.params.id;

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }

  // grab workout from body
  // may need to modify data depending on how it looks
  // also to fulfill the schema we have defined
  const exercise = req.body.exercise;

  // add workout to user's scheduledWorkouts section
  user.customExercises.push(exercise);

  await user.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
});

// removing custom exercise
router.route('/:id/exercises/custom/remove/:e_id').patch(async (req,res) => {
  const {id, e_id} = req.params;

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }

  // remove workout from user's scheduledWorkouts section
  user.customExercises = removeItemByID(user.customExercises, e_id);

  await user.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
});

// editing custom exercise
router.route('/:id/workouts/custom/edit/:e_id').patch(async (req,res)=> {
  const {id, e_id} = req.params;
  const {title, description, exerciseType, sets, reps, time, weight, restTime, tags, muscleGroups} = req.body;

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }

  for(const exercise of user.customExercises){
    if(exercise._id == e_id){
      if(title) {workout.title = title;}
      if(description) {workout.description = description;}
      if(exerciseType) {workout.exerciseType = exerciseType;}
      if(sets) {workout.sets = sets;}
      if(reps) {workout.reps = reps;}
      if(time) {workout.time = time;}
      if(weight) {workout.weight = weight;}
      if(restTime) {workout.restTime = restTime;}
      if(tags) {workout.tags = tags;}
      if(muscleGroups) {workout.muscleGroups = muscleGroups;}
    }
  }

  await user.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
})

// adding custom workout
router.route('/:id/workouts/custom/schedule').post(async (req,res) => {
  const id = req.params.id;

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }

  // grab workout from body
  // may need to modify data depending on how it looks
  // also to fulfill the schema we have defined
  const workout = req.body.workout;

  // add workout to user's scheduledWorkouts section
  user.scheduledWorkouts.push(workout);

  workout.recurrence = false;
  workout.scheduledDate = null;
  user.customWorkouts.push(workout);

  await user.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
});

// remove custom workout from user's account
router.route('/:id/workouts/custom/remove/:w_id').patch(async (req,res) => {
  const {id, w_id} = req.params;

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }

  // grab workout from body
  //const workout = req.body.workout;

  // remove workout from user's scheduledWorkouts section
  user.customWorkouts = removeItemByID(user.customWorkouts, w_id);

  await user.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
});

// edit custom workout
router.route('/:id/workouts/custom/edit/:w_id').patch(async (req,res)=> {
  const {id, w_id} = req.params;
  const {title, description, exercises, duration, location, scheduledDate, dateOfCompletion, tags, muscleGroups} = req.body;

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }

  for(const workout of user.customWorkouts){
    if(workout._id == w_id){
      if(title) {workout.title = title;}
      if(description) {workout.description = description;}
      if(exercises) {workout.exercises = exercises;}
      if(duration) {workout.duration = duration;}
      if(location) {workout.location = location;}
      if(scheduledDate) {workout.scheduledDate = scheduledDate;}
      if(dateOfCompletion) {workout.dateOfCompletion = dateOfCompletion;}
      if(tags) {workout.tags = tags;}
      if(muscleGroups) {workout.muscleGroups = muscleGroups;}
    }
  }

  await user.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
})

// adding workout
router.route('/:id/workouts/schedule').post(async (req,res) => {
  const id = req.params.id;

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }

  // grab workout from body
  // may need to modify data depending on how it looks
  // also to fulfill the schema we have defined
  const workout = req.body.workout;

  // add workout to user's scheduledWorkouts section
  user.scheduledWorkouts.push(workout);

  await user.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
});

// remove scheduled workout from user's account
router.route('/:id/workouts/remove/:w_id').patch(async (req,res) => {
  const {id, w_id} = req.params;

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }

  // grab workout from body
  //const workout = req.body.workout;

  // remove workout from user's scheduledWorkouts section
  user.scheduledWorkouts = removeItemByID(user.scheduledWorkouts, w_id);

  await user.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
});

// edit scheduled workout from user's account
router.route('/:id/workouts/edit/:w_id').patch(async (req,res) => {
  const {id, w_id} = req.params;
  const {title, description, exercises, duration, location, scheduledDate, dateOfCompletion, tags, muscleGroups, scheduledDate, recurrence} = req.body;

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }

  for(const workout of user.customWorkouts){
    if(workout._id == w_id){
      if(title) {workout.title = title;}
      if(description) {workout.description = description;}
      if(exercises) {workout.exercises = exercises;}
      if(duration) {workout.duration = duration;}
      if(location) {workout.location = location;}
      if(scheduledDate) {workout.scheduledDate = scheduledDate;}
      if(dateOfCompletion) {workout.dateOfCompletion = dateOfCompletion;}
      if(tags) {workout.tags = tags;}
      if(muscleGroups) {workout.muscleGroups = muscleGroups;}
      if(scheduledDate) {workout.scheduledDate = scheduledDate;}
      if(recurrence) {workout.recurrence = recurrence;}
    }
  }

  await user.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });
});

// user completes a workout. Must move workout to complete
router.route('/:id/workouts/complete/:w_id').patch(async (req,res) => {
  const {id,w_id} = req.params;

  const user = await User.findById(id);
  if (!user)
  {
    return res.status(498).send({Error: "User does not exist!"});
  }

  const workout = user.scheduledWorkouts.filter(w => w._id == w_id)[0];
  // remove anyways
  user.scheduledWorkouts = removeItemByID(user.scheduledWorkouts, w_id);
  
  // if recurring add in again but a week in advance
  if(workout.recurrence){
    var date = workout.scheduledDate ? new Date(workout.scheduledDate) : new Date();
    date.setDate(date.getDate() + 7);
    workout.scheduledDate = date;
    user.scheduledWorkouts.push(workout);
  }

  // recurrence = false
  workout.recurrence = false;
  console.log(workout)
  // add to completed anyways
  user.completedWorkouts.push(workout);

  await user.save((err, newUser) => {
    if (err) return res.status(499).send(err);
    res.status(200).json(newUser);
  });

});

// user A invites user B
router.route('/:A_id/invites/add/:B_id').patch(async (req,res) => {
  // get id's from url
  const {A_id, B_id} = req.params;
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

// user A accepts user B
router.route('/:A_id/invites/accept/:B_id').patch(async (req,res) => {
  // get id's from url
  const {A_id, B_id} = req.params;
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

// user A denies user B
router.route('/:A_id/invites/reject/:B_id').patch(async (req,res) => {
  // get id's from url
  const {A_id, B_id} = req.params;
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
// user A unfriends B
router.route('/:A_id/friends/remove/:B_id').patch(async (req,res) => {
  // get id's from url
  const {A_id, B_id} = req.params;
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
// user A blocks user B
router.route('/:A_id/blocked/add/:B_id').patch(async (req,res) => {
  // get id's from url
  const {A_id, B_id} = req.params;
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

// user A unblocks user B
router.route('/:A_id/blocked/remove/:B_id').patch(async (req,res) => {
  // get id's from url
  const {A_id, B_id} = req.params;
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

// TO-DO Password reset
// not sure what to throw into this endpoint to complete this.
// still need to get to anyways

module.exports = router;