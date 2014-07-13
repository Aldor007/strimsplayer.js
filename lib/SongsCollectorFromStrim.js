var SongsCollector = require('./SongsCollector.js').SongsCollector;
var url = require('url');

var SongsCollectorFromStrim = function() {
     SongsCollector.apply(this, arguments);
     this.request = null;
};

SongsCollectorFromStrim.prototype.setRequest = function (request) {
    this.request = request;
};

SongsCollectorFromStrim.prototype.execute = function (callback) {
    var strimsArray = [];
    var that = this;
    var strim = url.parse(this.request.url).pathname.split('/');
    console.info('SongsCollectorFromStrim strim=',strim);
    if (!strim || strim.length === 1) {
        callback({status: 400, message: 'No strim field!'});
        return;
    }
    strim = strim[2];
    strimsArray.push(strim);
    this.strims.getContentOfArrayOfStrims(strimsArray, function( error, songs) {
        if (error) {
            console.error('SongsCollect/process error gettingStrims ', error);
            return;
        }
        that.strimsplayer.addSong(songs, callback);
    
    });
    
};
SongsCollectorFromStrim.prototype.getName = function () {
    return 'SongsCollectorFromStrim';
};

exports.SongsCollectorFromStrim = SongsCollectorFromStrim;

