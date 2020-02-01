const express = require('express');
const router = express.Router();

const isAuthenticated = require(process.cwd() + '/modules/security/AuthFunction').isAuthenticated;

const users = require(process.cwd() + '/modules/db/users');

router.get('/:postId', (req, res) => {
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

module.exports = router;
