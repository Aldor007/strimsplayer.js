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
        sails.log.info('SongController/add called with songs=' + req.param('song'));
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
                    sails.log.error("Error: " + err1);
                    return res.json(500,err1);
                } else {
                    sails.log.info("Song added "  + JSON.stringify(saved));
                    res.json('ok');
                }
                
            });
        
        
        });
        
    },
    list: function(req, res) {
        var reqStrim = req.param('id');
        var after = req.param('after') || 0;
        var limit = req.param('limit') || 20;
        sails.log.info('SongController/list reqStrim=%s, after=%s, limit=%s',reqStrim, after, limit);
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
    },
    listByName: function(req, res) {
        var reqStrims = req.param('id');
        var after = req.param('after')||0;
        var limit = req.param('limit') || 20;
        sails.log.info('SongController/listByName reqStrim=%s, after=%s, limit=%s',reqStrims, after, limit);
        if (reqStrims == null || reqStrims == undefined) {
            sails.log.info('SongController/listByName all songs action');
            Song.find().where({
                    id: {
                    '>': after
                    }})
                    .limit(limit)
                    .sort('date ASC')
                    .exec(function (err, songs) {
                        if (err) {
                            sails.log.error('SongController/listByName all songs action error', err);
                            res.json(err.status, err.message);
                        } else {
                            res.json(songs);
                        }
        
            });
        } else {
            var findQuery;
            if(reqStrims.indexOf('+') != -1){
                findQuery = { or: []};
                var multiStrimSearch = reqStrims.split('+');
                for (var i = 0, len = multiStrimSearch.length; i < len; i++) {
                    findQuery.or.push( {slug: {
                        contains: multiStrimSearch[i]
                    }});
                }
            } else {
                findQuery = {slug: reqStrims};
            }
            var result = [];
            Strim.find(findQuery).exec(function (strimErr, strims) {
                if(strimErr) {
                    sails.log.error('SongController/listByName find strim error =', strimErr);
                    res.send(strimErr.status, strimErr.message);
                    return;
                }
                var len = strims.length;
                for( var i = 0; i < len; i++) {
                    (function (iter) {
                        Song.find().where( { strim: strims[i].id, id: {
                            '>': after
                        } }).limit(limit)
                        .sort('date ASC')
                        .exec(function (err, songs) {
                            if (err) {
                                sails.log.error('SongController/listByName find song  error =', err);
                                res.json(err.status);
                            } else {
                                songs.forEach(function (element, index) {
                                    result.push(element);
                                })
                                if (iter == len - 1)
                                    res.json(result);
                            }
                        });
                    })(i);
                
                }
            });
        
        
        }
    }
};

