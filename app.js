var express = require('express'),
    cookieParser = require('cookie-parser'),
    i18n = require('i18n'),
    hbs = require('hbs'),
    app = module.exports = express();

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

  // setup hbs
  app.set('views', "" + __dirname + "/views");
  app.set('view engine', 'hbs');
  app.engine('hbs', hbs.__express);
  app.use(express.static(__dirname + '/public'));

  // you'll need cookies
  app.use(cookieParser());

  // init i18n module for this loop
  app.use(i18n.init);

  app.use(function(req, res, next) {
    i18n.setLocale(i18n.getLocale(req));
    return next();
  });

var blocks = {};

// register hbs helpers in res.locals' context which provides this.locale
hbs.registerHelper('__', function () {
  return i18n.__.apply(this, arguments);
});
hbs.registerHelper('__n', function () {
  return i18n.__n.apply(this, arguments);
});

hbs.registerHelper('language', function() {
    return i18n.getLocale();
});

hbs.registerPartials(__dirname + '/views' [, callback]);

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

app.use(function(req,res,next){
    res.locals.language = req.getLocale();
    next();
})

app.get('/', function(req, res){
    res.render('index');
});
app.get('/imprint', function(req, res){
    res.render('index',{title: i18n.__('Impressum')});
});

app.get('/lang/:locale', function (req, res) {
  res.cookie('locale', req.params.locale);
  i18n.setLocale(i18n, req.params.locale);
  res.redirect(req.headers.referer);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
