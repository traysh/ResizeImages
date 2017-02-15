var request = require('request').defaults({encoding: null});

module.exports = {
    json: function(url, cb) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                cb(JSON.parse(body));
            }
        })
    },
    image: function (url, cb) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                cb(body);
            }
        });
    }
}
