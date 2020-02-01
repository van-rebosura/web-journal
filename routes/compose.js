const express = require('express');
const router = express.Router();

const users = require(process.cwd() + '/modules/db/users.js');

const isAuthenticated = require(process.cwd() + '/modules/security/AuthFunction').isAuthenticated;

router.get('/', (req, res) => {
  if(isAuthenticated(req)) {
    res.render('compose');
  } else {
    res.redirect('/');
  }
});

router.post('/', (req, res) => {
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

// function isAuthenticated(req) {
//   let access = false;
//   if(req.session) {
//     let view = req.session.view;
//     users.forEach((user) => {
//       if(view == user.activeSession) {
//         access = true;
//       }
//     });
//   } else {
//     return false;
//   }
//
//   if(access) {
//     return true;
//   }
// }

module.exports = router;
