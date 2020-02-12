const mongoose = require('mongoose');

const Post = require(process.cwd() + '/models/Post.js').Post;
const postSchema = require(process.cwd() + '/models/Post.js').postSchema;

let userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  session: {
    type: String
  },
  posts: {
    type: [postSchema]
  }
});

let User = mongoose.model('User', userSchema);

let createUser = (email, password, firstName, lastName) => {
  return new User({email, password, firstName, lastName});
};

module.exports.User = User;
module.exports.createUser = createUser;
module.exports.userSchema = userSchema;
