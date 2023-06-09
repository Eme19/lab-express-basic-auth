
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const router = require("express").Router();

const User = require('../models/User.model');


router.get("/signup", (req,res, next) => {
    res.render('auth/signup')
});

router.post("/signup", (req, res, next)=> {
    console.log(req.body)

    const {username, password} = req.body;
    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
        return User.create({username, passwordHash: hashedPassword});
    })

    .then(userFromDB => {
        console.log("new create user:", userFromDB);
        res.redirect(`/auth/profile/${userFromDB.username}`)
        .then(()=> mongoose.connection.close())
    })
    .catch(error => next(error));
});

router.get("/profile/:username", (req, res, next )=>{
    User.findOne({ username: req.params.username})
    .then(founduserFromDB => {
        console.log(founduserFromDB)
        res.render('auth/profile', founduserFromDB)
        .then(()=> mongoose.connection.close())
    })
    .catch(err => console.log(err))
});


module.exports = router;