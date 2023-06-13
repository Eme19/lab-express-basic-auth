const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = app => {

  app.set('trust proxy', 1);
 
  app.use(
    session({
      secret: 'Super safe secret',
      resave: true,
      saveUninitialized: true,
      store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lab-express-basic-auth",
      }), 
      cookie: {
      httpOnly: true,
      maxAge: 600000 
      },
      
    })
  );
};