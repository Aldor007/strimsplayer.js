/**
 * SongsController
 *
 * @description :: Server-side logic for managing songs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var url = require('url');
module.exports = {
    add: function(req, res) {
        var song = JSON.parse(req.param('song'))
        console.log('SongController/add called with songs=' + req.param('song'));
        if (song.domain == 'youtube.com' || song.domain == 'youtu.be') {
            var yt_id = url.parse(song.domain_url, true).query.v;
            song.domain_id = yt_id;
            song.domain = 'youtube';
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
                    return res.json(500,err1);
                } else {
                    console.log("Song added "  + JSON.stringify(saved));
                    res.json('ok');
                }
                
            });
        
        
        });
        
    },
    list: function(req, res) {
        var reqStrim = req.param('id');
        var after = req.param('after');
        var limit = req.param('limit') || 20;
        console.log('SongController/list reqStrim=%s, after=%s, limit=%s',reqStrim, after, limit);
        if (reqStrim == undefined) {
            Song.find().where({
                    id: {
                    '>': after
                    }}).limit(limit).exec(function (err, songs) {
                if (err) {
                    return res.send(500);
                } else {
                    res.json(songs);
                }
        
            });
        } else {
            Song.find().where( { strim: reqStrim, id: {
                '>': after
            } }).limit(limit).exec(function (err, songs) {
                if (err) {
                    return res.send(500);
                } else {
                    res.json(songs);
                }
        
        });
        
        
        }
    }
};

