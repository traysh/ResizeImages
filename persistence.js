var mongoose = require('mongoose');

module.exports = {
    store_urls: function(original_url, small_url, medium_url, large_url) {
        let url = new Url({
            original_url: original_url,
            small_url: small_url,
            medium_url: medium_url,
            large_url: large_url
        });
    
        url.save(function(err) {
            if (err) throw err;
        });
    },
    
    store_image: function(url, image_data) {
        let image = new Image({
            url: url,
            data: image_data
        });
    
        image.save(function(err) {
            if (err) throw err;
        });
    },
    
    retrieve_image: function(url, cb) {
        Image.findOne({ url: url }).exec(function (err, doc) {
            if (!doc)
                err = true
                
            cb(err, doc);
        });
    },
    
    retrieve_urls: function(cb) {
        Url.find({original_url: { $ne: null }}, '-_id original_url small_url medium_url large_url', function (err, docs) {
            if (err) throw err;
            
            console.log(docs);
            cb(docs);
        });
    },
    
    refresh: function(callback) {
        let clear_collection = function(collection) {
            return function(cb) {
                collection.count(function (err, count) {
                    if (err) throw err;
                                
                    if (count === 0)
                        cb();
                    else
                        collection.drop(cb);
                });
            };
        };
            
        let urls_collection = mongoose.connection.collections['urls'];
        let images_collection = mongoose.connection.collections['images'];
        
        let clear_urls = clear_collection(urls_collection);
        let clear_images_and_urls = function (cb) { clear_urls(cb) };
        clear_images_and_urls(callback);
    },
    
    close: function() {
        refresh(function() {
            db.close(function (err) {
                if(err) throw err;
            });
        });
    }
}

var uri = process.env.MONGODB_URI
mongoose.Promise = global.Promise
mongoose.connect(uri);

var urls_schema = mongoose.Schema({
    original_url: String,
    small_url: String,
    medium_url: String,
    large_url: String
});

var images_schema = mongoose.Schema({
    url: String,
    data: Buffer
});

var Url = mongoose.model('urls', urls_schema);
var Image = mongoose.model('images', images_schema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
