// jshint esversion:6

// dependencies
const dotenv = require('dotenv').config({ path: __dirname + '/keys/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieSession = require('cookie-session');


console.log('dotenv testing: ' + process.env.TESTING);

// initializations
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(cookieSession({
  name: 'session',
  secret: 'secret key'
}));

app.use(express.static(__dirname + '/public'));

// heroku dynamic port
let port = process.env.PORT;

if (!port || port === null) {
  //localhost port
  port = 3000;
}


const users = require(__dirname + '/modules/db/users.js');

const isAuthenticated = require(__dirname + '/modules/security/AuthFunction').isAuthenticated;

app.listen(port, (err) => {
  if (!err) {
    console.log('server started at port ' + port);
  }
});

// root route

app.get('/', (req, res) => {

  let access = false;

  if (req.session.view) {
    console.log('session found, session id: ' + req.session.view);

    let view = req.session.view;
    users.forEach((user) => {
      if (view === user.activeSession) {
        console.log('/ root: found session');

        let ejsVariables = {
          fullName: user.name.fname + ' ' + user.name.lname,
          posts: user.posts
        }

        res.render('dashboard', ejsVariables);

        access = true;
      }
    });
  } else {
    console.log('no session');
    access = false;
  }

  // if no valid cookie found, redirect to login
  if (!access) {

    let ejsVariables = {
      email: '',
      password: '',
      invalidCredentials: false
    }

    res.render('login', ejsVariables);
  }

});

// navigation routes

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/account', (req, res) => {
  if(isAuthenticated(req)) {
    res.render('account');
  } else {
    res.redirect('/');
  }
});

app.post('/login', (req, res) => {

  inputEmail = req.body.email;
  inputPassword = req.body.password;

  let access = false;

  let userId = '';

  users.forEach((user) => {
    if (user.email === inputEmail && user.password === inputPassword) {
      userId = user.id;
      access = true;
      let date = Date.now();
      console.log('/login access granted date: ' + date);
      req.session.view = date + userId;
      console.log('/login session: ' + req.session.view);
      user.activeSession = req.session.view;
    }
  });

  if (access) {
    res.redirect('/');
  } else {

    // redirect back to login
    let ejsVariables = {
      email: inputEmail,
      password: inputPassword,
      invalidCredentials: true
    }
    res.render('login', ejsVariables);
  }
});

// compose route
app.use('/compose', require(__dirname + '/routes/compose'));

// post route
app.use('/posts', require(__dirname + '/routes/post'));

// logout route
// should be part of accounts route(?)
app.post('/logout', (req, res) => {
  if(isAuthenticated(req)) {
    req.session.view = '';
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});
