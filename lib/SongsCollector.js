var SongsCollector = function(strimsplayer, strims) {
    this.strimsplayer = strimsplayer;
    this.strims = strims;
};

SongsCollector.prototype.setRequest = function () {

};

SongsCollector.prototype.execute = function (callback) {
    var that = this;
    this.strimsplayer.getStrimsList(function (error, strims) {
        if (error) {
            console.error('SongsCollect/execute error getting strims list from strims player error=', error);
            callback(error, null);
            return;
        }
        var strimsArray = [];
        for (var i = 0, len = strims.length; i < len; i++) {
            strimsArray.push(strims[i].slug);
        }
        that.strims.getContentOfArrayOfStrims(strimsArray, function( error, songs) {
            if (error) {
                console.error('SongsCollect/process error gettingStrims ', error);
                return;
            }
            that.strimsplayer.addSong(songs, callback);
        
        });
    
    });
};
SongsCollector.prototype.getName = function() {
    return 'SongsCollector';
};

exports.SongsCollector = SongsCollector;

