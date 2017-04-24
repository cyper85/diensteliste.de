var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var i18n = require('i18n');
var hbs = require('hbs');

var index = require('./routes/index');
var imprint = require('./routes/imprint');
var project = require('./routes/project');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

i18n.configure({
  // setup some locales - other locales default to en silently
  locales: ['de', 'en'],

    // fall back from Dutch to German
    fallbacks:{'en': 'de'},

    // you may alter a site wide default locale
    defaultLocale: 'de',

  // sets a custom cookie name to parse locale settings from
  cookie: 'locale',

  // where to store json files - defaults to './locales'
  directory: __dirname + '/lang'
});

hbs.localsAsTemplateData(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser());
app.engine('hbs', hbs.__express);
app.use(express.static(path.join(__dirname, 'public')));

// init i18n module for this loop
app.use(i18n.init);

app.use(function(req, res, next) {
  i18n.setLocale(i18n.getLocale(req));
  return next();
});


app.use('/', index);
app.use('/Imprint', imprint);
app.param('id',function(req, res, next, id){
    var regex = new RegExp(/^[0-9a-z-]{3,24}$/);
    if(regex.test(id)){
      req.id = id;
        next();
    }else{
      next('route');
    }
});
app.use('/:id', project);

hbs.registerHelper('__', function () {
  return i18n.__.apply(this, arguments);
});
hbs.registerHelper('__n', function () {
  return i18n.__n.apply(this, arguments);
});

hbs.registerHelper('language', function() {
    return i18n.getLocale();
});
hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
