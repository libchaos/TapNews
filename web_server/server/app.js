var express = require('express');
var path = require('path');
var cors = require('cors');

var index = require('./routes/index');
var news = require('./routes/news');
var auth = require('./routes/auth');
var config = require('./config/config.json');
require('./models/main').connect(config.mongoDbUri);
var passport = require('passport');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '../client/build/'));

app.use('/static', express.static(path.join(__dirname, '../client/build/static')));
app.use(bodyParser.json());

//solve cross-origin request problem
app.use(cors());

app.use('/', index);
app.use('/auth', auth);
//all request to news need to check if there is valid token
const auth_checker = require('./middleware/auth_checker');
app.use('/news', auth_checker);
app.use('/news', news);

app.use(passport.initialize());
var localSignupStrategy = require('./passport/signup_passport');
var localLoginStrategy = require('./passport/login_passport');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.send('404 Not Found')
});


module.exports = app;
