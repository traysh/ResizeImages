var mongoose = require('mongoose');

module.exports = {
    store: function(url, smallImage, mediumImage, largeImage) {
        let image = new Image({
            url: url,
            smallImage: smallImage,
            mediumImage: mediumImage,
            largeImage: largeImage
        });
    
        image.save(function(err) {
            if (err) throw err;
        });
    },
    
    retrieve: function(url, cb) {
        Image.findOne({ url: url }).exec(function (err, doc) {
            if (err) throw err;
            console.log('inner: ' + doc);
            cb(doc);
        });
    },
    
    close: function() {
        mongoose.connection.collections['images'].drop(function (err) {
            if(err) throw err;

            db.close(function (err) {
                if(err) throw err;
            });
        });
    }
}

var uri = process.env.MONGODB_URI
mongoose.Promise = global.Promise
mongoose.connect(uri);

// Create schema
var schema = mongoose.Schema({
    url: String,
    smallImage: Buffer,
    mediumImage: Buffer,
    largeImage: Buffer
});

// Store image documents in a collection called "images"
var Image = mongoose.model('images', schema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
