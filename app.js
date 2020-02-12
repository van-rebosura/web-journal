// jshint esversion:6

// dependencies
const dotenv = require('dotenv').config({
  path: __dirname + '/keys/.env'
});
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');

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

// mongodb
let mongoDbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

let connection = mongoose.connect('mongodb://localhost/bloggerDB', mongoDbOptions, (err) => {
  (err) ? console.log(err): console.log('connected to db successfully');
});


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
