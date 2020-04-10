const env = process.env.NODE_ENV || 'development';
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
const logger = require('morgan');
const flash = require('connect-flash');

const helmet = require('helmet');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
// require('./discordBot.js');
app.config = require('./config.json')[env];

// View Engine
app.enable('trust proxy');
app.enable('strict routing');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({
  defaultLayout: 'layout',
}));
app.set('view engine', 'handlebars');

if (app.get('env') === 'production') {
  app.use(logger('combined'));
} else {
  app.use(logger('dev'));
}

// Helmet Security
app.use(helmet());

// Body parser for POST
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  if (req.url != '/favicon.ico') {
    return next();
  } else {
    res.status(200);
    res.header('Content-Type', 'image/x-icon');
    res.header('Cache-Control', 'max-age=4294880896');
    res.end();
  }
});

app.use(session({
  secret: app.config.site.session_secret,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passportDiscord.js')(app);
fs.readdirSync('./api/routes/').forEach(function(file) {
  const route = './api/routes/' + file.substr(0, file.indexOf('.'));
  console.log('Adding route:' + route);
  require(route)(app);
});

// 404 catch-all handler (middleware)
app.use((req, res, next) => {
  res.status(404);
});

// 500 error handler (middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
});

app.listen(app.config.site.port);
console.log('[!] Website is online.');
