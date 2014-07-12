/**
 * SongsController
 *
 * @description :: Server-side logic for managing songs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var url = require('url');
var fromString = require('../../lib/date.js').DatefromString;
Date.fromString = fromString;







module.exports = {
    add: function(req, res) {
        var song = JSON.parse(req.param('song'))
        console.log('SongController/add called with songs=' + req.param('song'));
        if (song.domain.indexOf('tu') != -1) {
            song.domain = 'youtube';
        }
        else {
            song.domain_id = 'unknow';
            res.json(400, "not supported");
        }
        song.date = Date.fromString(song.date);
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
                    }})
                    .limit(limit)
                    .sort('date ASC')
                    .exec(function (err, songs) {
                if (err) {
                    return res.send(500);
                } else {
                    res.json(songs);
                }
        
            });
        } else {
            Song.find().where( { strim: reqStrim, id: {
                '>': after
            } }).limit(limit)
            .sort('date ASC')
            .exec(function (err, songs) {
                if (err) {
                    return res.send(err.status);
                } else {
                    res.json(songs);
                }
        
        });
        
        
        }
    }
};

