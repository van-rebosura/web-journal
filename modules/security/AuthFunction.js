const mongoose = require('mongoose');

const users = require(process.cwd() + '/modules/db/users');

const userModel = require(process.cwd() + '/models/User.js').User;

function isAuthenticated(req) {
  if(req.session.view) {
    return true;
  } else {
    return false;
  }
}

module.exports.isAuthenticated = isAuthenticated;
