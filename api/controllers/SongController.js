/**
 * SongsController
 *
 * @description :: Server-side logic for managing songs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var url = require('url');
module.exports = {
    add: function(req, res) {
        var song = JSON.parse(req.param('song'));
        if (song.domain == 'youtube.com' || song.domain == 'you') {
            var yt_id = url.parse(song.domain_url, true).query.v;
            song.domain_id = yt_id;
        }
        else {
            song.domain_id = 'unknow';
        }
        Strim.findOneBySlug(song.strim, function(err, strim) {
            
            if (strim === undefined) return res.notFound();
            if (err) return next(err);
            song.strim = strim;
            Song.create(song).exec(function (err1, saved) {
                if(err1) {
                    console.error("Error: " + err1);
                    res.status(500);
                    return res.json(err1);
                } else {
                    console.log("Song added "  + saved);
                    res.json('ok');
                }
                
            });
        
        
        });
        
    }
};

