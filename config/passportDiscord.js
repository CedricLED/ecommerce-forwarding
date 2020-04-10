const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const Customer = require('../api/models').Customer;
const request = require('request');

const scopes = ['identify', 'email', 'guilds.join'];
module.exports = (app) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    Customer.findOne({
      where: {
        id: id,
      },
    }).then((user, err) => {
      done(err, user);
    });
  });

  passport.use(new DiscordStrategy({
    clientID: app.config.discord.client_id,
    clientSecret: app.config.discord.client_secret,
    callbackURL: app.config.discord.callback_url,
    scope: scopes,
  }, async function(accessToken, refreshToken, profile, done) {
    request.put({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bot ${app.config.discord.token}`,
      },
      url: `https://discordapp.com/api/guilds/${app.config.discord.guild}/members/${profile.id}`,
      body: JSON.stringify({
        'access_token': accessToken,
      }),
    });
    Customer.findOne({
      where: {
        discordID: profile.id,
      },
    }).then((user) => {
      if (!user) {
        Customer
            .create({
              username: profile.username,
              banned: false,
              email: profile.email,
              discordID: profile.id,
              descrim: profile.discriminator,
            }).then((user) => done(null, user))
            .catch((err) => done(err));
      } else {
        user.update({
          username: profile.username,
          descrim: profile.discriminator,
          email: profile.email,
        }).then((user) => done(null, user)).catch((err) => done(err));
      }
    }).catch((err) => done(err));
  }));
};
