var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/lang/:locale', function (req, res) {
  console.log("set-locale");
  res.cookie('locale', req.params.locale);
  i18n.setLocale(i18n, req.params.locale);
  res.redirect(req.headers.referer);
});

module.exports = router;
