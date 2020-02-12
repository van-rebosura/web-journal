const mongoose = require('mongoose');

let postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  }
});

let Post = mongoose.model('Post', postSchema);

let createPost = (title, post) => {
  return new Post({
    title,
    post
  });
}

module.exports.Post = Post;
module.exports.createPost = createPost;
module.exports.postSchema = postSchema;
