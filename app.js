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

    let ejsVariables = {
      email: '',
      password: '',
      invalidCredentials: false
    }

    res.render('login', ejsVariables);
  }

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

// TEMPORARY ACTING DB

const users = [{
  id: '41231vb23uyv4112y3v',
  email: 'rebosuravan@gmail.com',
  password: 'fasfoifn23fasofina',
  name: {
    fname: 'Van Jacob',
    lname: 'Rebosura',
  },
  activeSession: '',
  posts: []
}];


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

app.get('/compose', (req, res) => {
  if(isAuthenticated(req)) {
    res.render('compose');
  } else {
    res.redirect('/');
  }
});

// post routes

app.post('/post', (req, res) => {
  if(isAuthenticated(req)) {
    let date = Date.now();
    let title = req.body.title;
    let content = req.body.content;
    let truncatedContent = content.substr(0, 100);
    if(truncatedContent.length === 100) {
      truncatedContent += '...';
    }
    users.forEach((user) => {
      if(req.session.view == user.activeSession) {
        let post = {
          id: user.id + date,
          author: user.id,
          title: title,
          content: content,
          truncatedContent: truncatedContent,
          date: date
        }
        user.posts.push(post);
        console.log(post);
      }
    });
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

// view post route
app.get('/posts/:postId', (req, res) => {
  console.log(req.params);
  let access = false;
  let postId = req.params.postId;
  let ejsVariables = {};
  if(isAuthenticated(req)) {
    users.forEach((user) => {
      user.posts.forEach((post) => {
        if(post.id == postId) {
          access = true;
          ejsVariables.post = post;
        }
      });
    });
    if(access) {
      res.render('post', ejsVariables);
    } else {
      console.log('/posts/:postId: 404');
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
});

function isAuthenticated(req) {
  let access = false;
  if(req.session.view) {
    let view = req.session.view;
    users.forEach((user) => {
      if(view == user.activeSession) {
        access = true;
      }
    });
  } else {
    return false;
  }

  if(access) {
    return true;
  }
}
