var express = require('express');
var path = require('path');
var cors = require('cors');

var index = require('./routes/index');
var news = require('./routes/news');
var config = require('./config/config.json');
require('.models/main.js').connect(config.mongoDbUri);

var app = express();

// view engine setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '../client/build/'));

app.use('/static', express.static(path.join(__dirname, '../client/build/static')));

app.use(cors());

app.use('/', index);
app.use('/news', news);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.send('404 Not Found')
});


module.exports = app;
