
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const router = require("express").Router();

const User = require('../models/User.model');


const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');

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
        const {username, password} = userFromDB;

        req.session.currentUser = {username, password} 
        console.log("new create user:", userFromDB);
        res.redirect(`/auth/profile`)
    })
    .catch(error => next(error));
});





router.get('/login', isLoggedOut , (req, res)=> {
    console.log(req.session)
    if(req.session.currentUse){
        res.render('auth/login', {loggedIn: true})
    }
else{
    res.render('auth/login')
}
})



router.post('/login', (req, res)=> {
    console.log(req.body)
    const {username, password} = req.body;

User.findOne({username})
.then(user =>{
    console.log(user)
    if(!user){
      res.render('auth/login')
      return;
    }else if (bcryptjs.compareSync(password, user.passwordHash)){
        const {username, password} = user;
       req.session.currentUser = {username, password};
         user.loggedIn = true;
        res.render('auth/profile', user);
    }else {
        res.render('auth/login',{errorMessage: "Incorrect Password."})
    }
 })
 .catch(error => console.log("error while rendring auth  login"))
})




router.get("/profile", isLoggedIn, (req, res, next )=>{
    if(req.session.currentUser){

    User.findOne({username: req.session.currentUser.username})
    .then(founduserFromDB => {
        console.log(founduserFromDB)
        founduserFromDB.loggedIn = true;
        res.render('auth/profile', founduserFromDB)
    })
    .catch(err => console.log(err))
}else{
    res.render('auth/profile')
}
});

router.post('/logout', isLoggedIn, (req,res)=> {
    req.session.destroy( error => {
        if(error){
            res.redirect('/')
        }
    })
});





router.get("/main", isLoggedIn, (req, res, next )=>{
    if(req.session.currentUser){

    User.findOne({username: req.session.currentUser.username})
    .then(userDB => {
        console.log(userDB)
        userDB.loggedIn = true;
        res.render('auth/main', userDB)
    })
    .catch(err => console.log(err))
}else{
    res.render('auth/main')
}
});






router.post('/main', (req, res)=> {
console.log(req.body)
const {username, password} = req.body;

User.findOne({username})
.then(user =>{
console.log(user)
if(!user){
  res.render('auth/login')
  return;
}else if (bcryptjs.compareSync(password, user.passwordHash)){
    const {username, password} = user;
   req.session.currentUser = {username, password};
     user.loggedIn = true;
    res.render('auth/main', user);
}else {
    res.render('auth/login',{errorMessage: "Incorrect Password."})
}
})
.catch(error => console.log("error while rendring auth  login"))
})



router.get('/private', isLoggedIn, (req, res, next)=> {
    if(req.session.currentUser){
User.findOne({username: req.session.currentUser.username})
.then((authUserDB) => {
     authUserDB.loggedIn = true;
     res.render('auth/private', authUserDB )
})
.catch(error => console.log('error while rendering Auth Private.', error))
    }else{
        res.render('auth/login')
    }
});


router.post('/private', (req, res, next)=>{
    const {username, password} =req.body;
   User.findOne({username})
   .then((user)=>{
if(!user){
   res.render('auth/login')

  }else if(bcryptjs.compareSync(password, user.passwordHash)){
    req.session.currentUser = {username, password};
    user.loggedIn = true;
    res.render('auth/private', user)
  }else{
    res.render('auth/login', {errorMessage: "Incorrect Password."})
  }

   })

})
module.exports = router;