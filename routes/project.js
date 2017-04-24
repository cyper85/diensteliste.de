var express = require('express');
var router = express.Router();
var path = require('path');

var usedIds = [];

var prepareService = function(key, serviceDB, count) {
    if (serviceDB[key].type === "service") {
        if (count) {
            serviceDB[key].count = serviceDB[key].registered.length;
            delete serviceDB[key].registered;
        }
    } else {
        if (serviceDB[key].services.length === 0) {
            delete serviceDB[key];
        } else {
            for (var arrayKey in serviceDB[key].services) {
              if(usedIds.indexOf(serviceDB[key].services[arrayKey])) {
                // Fehler: Den hatten wir schon, also hier rauslöschen...
                serviceDB[key] = serviceDB[key].services.splice (arrayKey, 1);
              }
              if(typeof serviceDB[serviceDB[key].services[arrayKey]] === "undefined") {
                  // Service existiert nicht -> Löschen
                  serviceDB[key] = serviceDB[key].services.splice (arrayKey, 1);
              }
              serviceDB = prepareService(serviceDB[key].services[arrayKey],serviceDB,count);
            }
        }
    }
    return serviceDB;
};

/**
 *
 */
var prepareProject = function(projectID, readonly) {
    var count = false;
    var project = require(path.join(__dirname, '../data/'+projectID));
    if (typeof project.protected === "boolean") {
        count = project.protected;
    }
    // Lösche admin-codes aus Projekt
    if (readonly) {
        delete project["admin-codes"];
    }
    for (var key in project.services) {
        if (typeof project.serviceDB[project.services[key]] !== "undefined") {
            usedIds.push(project.services[key]);
            project.serviceDB = prepareService(project.services[key], project.serviceDB, count);
        } else {
            project.services = project.services.splice (key, 1);
        }
    }
    // Gebe bereinigtes Projekt zurück
    return JSON.stringify(project);
};

router.get('/', function(req, res) {
    res.render('project', {
        link: req.id,
        project: prepareProject(req.id, true)
    });
});

/* GET Impressum listing. */
router.get('/Imprint', function(req, res) {
    res.render('imprint', {
        title: 'Impressum',
        link: req.id
    });
});


module.exports = router;
