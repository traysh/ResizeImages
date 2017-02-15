var url = require("url");
var path = require("path");
var sharp = require('sharp');

var fetch = require('./fetch.js')
var persistence = require('./persistence.js')

module.exports = {
    database: function() {
        persistence.refresh(populate_database);
    }
}

function populate_database() {
    let base_url = '';
    
    fetch.json('http://54.152.221.29/images.json', function(data) {
        for (let i = 0; i < data.images.length; i++) {
            fetch.image(data.images[i].url, function (body) {
                let original_url = data.images[i].url;
                let original_basename = path.basename(url.parse(original_url).pathname);
                let small_url = base_url + 'small_' + original_basename;
                let medium_url = base_url + 'medium_' + original_basename;
                let large_url = base_url + 'large_ ' + original_basename;
                
                persistence.store_urls(original_url, small_url, medium_url, large_url);
                
                let imageSmall = sharp(body).resize(320,240).toBuffer();
                let imageMedium = sharp(body).resize(384,288).toBuffer();
                let imageLarge = sharp(body).resize(640,480).toBuffer();
                
                let promises = [imageSmall, imageMedium, imageLarge];
                Promise.all(promises).then(values =>
                    {
                        persistence.store_image(small_url, values[0]);
                        persistence.store_image(medium_url, values[1]);
                        persistence.store_image(large_url, values[2]);
                    }
                );
            })
        }
    });
}
