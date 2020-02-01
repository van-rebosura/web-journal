const users = require(process.cwd() + '/modules/db/users');

function isAuthenticated(req) {
  let access = false;
  if(req.session) {
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

module.exports.isAuthenticated = isAuthenticated;
