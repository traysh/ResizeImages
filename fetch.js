var request = require('request');

module.exports = {
    all: function() {
        request('http://54.152.221.29/images.json', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                return;
                let json = JSON.parse(body);
                for (let i = 0; i < json.images.length; i++) {
                    request(json.images[i], function (error, response, body) {
                        let image = body;
                        console.log(image);
                    })
                }
            }
        })
    }
}
