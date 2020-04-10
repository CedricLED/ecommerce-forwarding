const scopes = ['identify', 'email', 'guilds.join'];
const passport = require('passport');
module.exports = (app) => {
  app.get('/auth/discord', passport.authenticate('discord', {scope: scopes}), (res, req) => {});
  app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/',
  }), function(req, res) {
    res.redirect('/dashboard');
  });
};
