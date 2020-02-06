const express = require('express');
const router = express.Router();

const users = require(process.cwd() + '/modules/db/users.js');

const isAuthenticated = require(process.cwd() + '/modules/security/AuthFunction.js').isAuthenticated;

router.get('/', (req, res) => {
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

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/contact', (req, res) => {
  res.render('contact');
});

router.get('/account', (req, res) => {
  if(isAuthenticated(req)) {
    res.render('account');
  } else {
    res.redirect('/');
  }
});


// account access

// logout route
router.post('/logout', (req, res) => {
  if(isAuthenticated(req)) {
    logout(req);
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});



// login route
router.post('/login', (req, res) => {

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

// register route

router.get('/register', (req, res) => {
  //when user explicitly attempts to get to register page, log the account out.
  logout(req);
  res.render('register');
});

function logout(req){
  req.session.view = "";
}

module.exports = router;
