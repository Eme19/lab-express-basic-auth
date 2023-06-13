const router = require("express").Router();
const User = require('../models/User.model');

/* GET home page */
router.get("/", (req, res, next) => {
    if(req.session.currentUser){

    User.findOne({username: req.session.currentUser.username})
    .then(authenticatedUser => {
        console.log(authenticatedUser)
        authenticatedUser.loggedIn = true;
        res.render('index', authenticatedUser)
    })
    .catch(err => console.log(err))
}else{
    res.render('index')
}
});


module.exports = router;
