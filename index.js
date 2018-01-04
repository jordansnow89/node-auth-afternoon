const express = require('express');
const session = require('express-session');
const passport = require('passport')
const strategy = require('./strategy')
const request = require('request')

const app = express();
app.use( session({
  secret: 'Super secret, dont tell plz ',
  resave: false,
  saveUninitialized: false
}));

app.use( passport.initialize() );
app.use( passport.session() );
passport.use( strategy );

passport.serializeUser( (user, done) => {
  done(null, user);
});

passport.deserializeUser( (obj, done) => {
  done( null, obj );
});

app.get('/login',
  passport.authenticate('auth0',
  { successRedirect: '/followers', failureRedirect: '/login', failureFlash: true, connection: 'github' }
  )
);

app.get('/followers', (req, res, next) => {
    if (req.user){
      request (`https://api.github.com/users/${req.user.nickname}/followers`, {headers: {"User-Agent": req.user.nickname}} , function (error, response, body){
        res.json(response)
      })
    }  else {
      res.redirect('/login');
    }

} )



const port = 3000;
app.listen( port, () => { console.log(`I'm listening on ${port} dawg`); } );