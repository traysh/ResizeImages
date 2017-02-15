var express = require('express');
var path = require('path');
var app = express();

var populate = require('./populate.js');
var persistence = require('./persistence.js');

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
    let base_url = request.protocol + '://' + request.get('host') + request.originalUrl;
    persistence.retrieve_urls(function(urls) {
        for (let i = 0; i < urls.length; i++) {
            urls[i].small_url = base_url + urls[i].small_url;
            urls[i].medium_url = base_url + urls[i].medium_url;
            urls[i].large_url = base_url + urls[i].large_url;
        }
        response.send(urls);
    });
});

app.get('/*.jpg', function(request, response) {
    let original_basename = path.basename(request.originalUrl);
    persistence.retrieve_image(original_basename, function(err, image) {
        if (err)
            response.send('not found');
        else
            response.send(image.data);
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

populate.database();
