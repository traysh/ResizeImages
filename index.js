var express = require('express');
var app = express();

var populate = require('./populate.js');
var persistence = require('./persistence.js');

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
    persistence.retrieve_urls(function(urls) {
        response.send(urls);
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

populate.database();
