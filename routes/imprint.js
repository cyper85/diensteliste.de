var express = require('express');
var router = express.Router();

/* GET Impressum listing. */
router.get('/', function(req, res){
    res.render('imprint',{title: 'Impressum'});
});

module.exports = router;
