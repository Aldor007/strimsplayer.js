var unirest = require('unirest');
var path = require('path');


var StrimsPlayerAPI = function(url) {
    this.url = url;
};
StrimsPlayerAPI.prototype._call = function(method, options, callback) {
    if (!options.method) {
        throw new Error('Unknow method');
    }
    var headers = {};
    headers = {
             'Content-Type': 'application/json',
             'Accept': 'application/json',
             'User-Agent':'nodejs',
             'X-Info': 'strimsplayer.pl'
    };
    var url = this.url +  method;
    options.data = options.data || {};
    console.info('StrimsPlayerAPI/_call url=%s', url);
    unirest[options.method.toLowerCase()](url)
    .headers(headers)
    .type('json')
    .send( options.data)
    .end( function(res) {
        if (res.error) {
            console.error('StrimsPlayerAPI/_call error=', res.error)
            callback({status: 500, message: res.error});
        }
        if (res.status != 200) {
            console.error('StrimsPlayerAPI/_call error response status=%s body=%s',res.status, JSON.stringify(res.body));
            var error = {status: res.status || 503, message:res.body};
            return callback(error, null);
        }
        return callback(null, res.body);

    });

};
StrimsPlayerAPI.prototype.getStrimsList = function(callback) {
    this._call(StrimsPlayerAPI.API.LIST_STRIMS, {method: 'GET'}, callback);
};

StrimsPlayerAPI.prototype.addSong = function(songsData, callback) {
    if (typeof songsData !== 'string') {
        this._call(StrimsPlayerAPI.API.ADD_SONGARRAY, {method: 'POST', data: {songs: songsData}}, callback);
    } else {
        this._call(StrimsPlayerAPI.API.ADD_SONG, {method: 'POST', data: {song: songsData}}, callback);
    }
};

StrimsPlayerAPI.API = {};
StrimsPlayerAPI.API.ADD_SONG = '/api/songs/add';
StrimsPlayerAPI.API.ADD_SONGARRAY = '/api/songs/addarray';
StrimsPlayerAPI.API.LIST_STRIMS = '/api/strims/list';

exports.StrimsPlayerAPI = StrimsPlayerAPI;

