const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const users = require(process.cwd() + '/modules/db/users.js');

const userModel = require(process.cwd() + '/models/User.js').User;

const isAuthenticated = require(process.cwd() + '/modules/security/AuthFunction.js').isAuthenticated;

router.get('/', (req, res) => {
let access = isAuthenticated(req);
console.log(access);
  if(access) {

    console.log('index.js /(): session hit!');
    userModel.findOne({session: req.session.view}, (err, result) => {
      let ejsVariables = {
        fullName: result.firstName + " " + result.lastName,
        posts: result.posts
      };

      res.render('dashboard', ejsVariables);
    });
  } else {
        let ejsVariables = {
          email: '',
          password: '',
          invalidCredentials: false
        }

        res.render('login', ejsVariables);
  }

  // let access = false;
  //
  // if (req.session.view) {
  //   console.log('session found, session id: ' + req.session.view);
  //
  //   let view = req.session.view;
  //   // users.forEach((user) => {
  //   //   if (view === user.activeSession) {
  //   //     console.log('/ root: found session');
  //   //
  //   //     let ejsVariables = {
  //   //       fullName: user.name.fname + ' ' + user.name.lname,
  //   //       posts: user.posts
  //   //     }
  //   //
  //   //     res.render('dashboard', ejsVariables);
  //   //
  //   //     access = true;
  //   //   }
  //   // });
  //
  //   userModel.findOne({session: view}, (err, result) => {
  //     if(err) console.log(err);
  //     else if(result) {
  //       console.log("login hit!");
  //       let ejsVariables = {
  //         fullName: result.firstName + " " + result.lastName,
  //         posts: result.posts
  //       }
  //       res.render('dashboard', ejsVariables);
  //     } else {
  //       console.log('index.js: invalid');
  //     }
  //   });
  // } else {
  //   console.log('no session');
  //
  //   access = false;
  //
  // }
  //
  // // if no valid cookie found, redirect to login
  // if (!access) {
  //
  //   let ejsVariables = {
  //     email: '',
  //     password: '',
  //     invalidCredentials: false
  //   }
  //
  //   res.render('login', ejsVariables);
  // }
});

// navigation routes

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/contact', (req, res) => {
  res.render('contact');
});

router.get('/account', (req, res) => {
  if (isAuthenticated(req)) {
    res.render('account');
  } else {
    res.redirect('/');
  }
});


// account access

// logout route
router.post('/logout', (req, res) => {
  if (isAuthenticated(req)) {
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

  userModel.findOne({email: inputEmail, password: inputPassword}, (err, findResult) => {
    if(err) console.log(err);
    else if(findResult) {
      console.log('authenticated');
      let date = Date.now();
      req.session.view = date + findResult._id;

      userModel.findOneAndUpdate({email: inputEmail}, {session: req.session.view}, (err, updateResult) => {
        if(err) console.log(err);
        else if(updateResult) {
          console.log('update success');
          res.redirect('/');
        } else {
            let ejsVariables = {
              email: inputEmail,
              password: inputPassword,
              invalidCredentials: true
            }
            res.render('login', ejsVariables);
        }
      });
    }
  });

  // userModel.findOne({
  //   email: inputEmail,
  //   password: inputPassword
  // }, (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   } else if (result) {
  //     console.log("authenticated");
  //     access = true;
  //     let date = Date.now();
  //     req.session.view = date + result._id;
  //
  //     userModel.findOneAndUpdate({email: inputEmail}, {session: req.session.view}, (err, updateResult) => {
  //       if(err) console.log(err);
  //       else {
  //         res.redirect('/');
  //       }
  //     });
  //
  //   } else {
  //     let ejsVariables = {
  //       email: inputEmail,
  //       password: inputPassword,
  //       invalidCredentials: true
  //     }
  //     res.render('login', ejsVariables);
  //   }
  // });
});

// register route

router.get('/register', (req, res) => {
  //when user explicitly attempts to get to register page, log the account out.
  logout(req);
  let ejsOptions = {
    errors: null
  }
  res.render('register', ejsOptions);
});

// this function returns an error object
function createError(errorMsg) {
  return {
    message: errorMsg
  };
}


router.post('/register', (req, res) => {
  let errors = [];

  let User = require(process.cwd() + '/models/User.js').User;
  let createUser = require(process.cwd() + '/models/User.js').createUser;

  User.findOne({
    email: req.body.email
  }, (err, foundItem) => {
    if (err) console.log(err);
    else if (foundItem) {
      let error = createError('email is already registered');
      console.log(error);
      errors.push(error);
    } else {
      let user = createUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.password);
      user.save();
    }
  });

  console.log('we are here');


  if (errors.length !== 0) {
    console.log('we have errors');
    let ejsOptions = {
      errors
    };
    res.render('register', ejsOptions);
  }
});

function logout(req) {
  req.session.view = "";
}

module.exports = router;
