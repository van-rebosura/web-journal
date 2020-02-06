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
let port = (process.env.PORT) ? process.env.PORT : 3000;

const users = require(__dirname + '/modules/db/users.js');

app.listen(port, (err) => {
  if (!err) {
    console.log('server started at port ' + port);
  }
});

// root route and navigation routes
app.use('/', require(__dirname + '/routes/index'));

// compose route
app.use('/compose', require(__dirname + '/routes/compose'));

// post route
app.use('/posts', require(__dirname + '/routes/post'));
<<<<<<< HEAD



// logout route

app.post('/logout', (req, res) => {
  if(isAuthenticated(req)) {
    req.session.view = '';
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

// register route

app.get('/register', (req, res) => {
  res.render('register');
});
=======
>>>>>>> modular
