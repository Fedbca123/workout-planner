const router = require('express').Router();
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

let User = require('../models/user.model');

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
    });

    await user.save((err, newUser) => {
        if (err) return res.status(400).send(err);
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
        return res.status(200).json(user);
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
            return res.status(400).send({Error: "Cannot be deleted because ID does not exist"})
        }
    })
});

//------UPDATE-----//
router.route('/:id').patch(async (req, res) => {
    const id = req.params.id;
    
    const {name, friends, scheduledWorkouts, completedWorkouts, customWorkouts, } = req.body

    // Check if user exists
    const user = await User.findById(id);
    if (!user)
    {
        return res.status(400).send({Error: "User does not exist!"});
    }
    
    console.log(user.friends);

    if (name) {user.name = name;}
    if (friends) {user.friends = friends;}
    if (scheduledWorkouts) {user.scheduledWorkouts = scheduledWorkouts;}
    if (completedWorkouts) {user.completedWorkouts = completedWorkouts;}
    if (customWorkouts) {user.customWorkouts = customWorkouts;}

    await user.save((err, newUser) => {
        if (err) return res.status(400).send(err);
        res.status(200).json(newUser);
    });
});

// TO-DO Password reset
module.exports = router;