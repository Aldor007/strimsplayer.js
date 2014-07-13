/**
 * SongsController
 *
 * @description :: Server-side logic for managing songs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var url = require('url');
var DateUtils = require('../../lib/DateUtils.js').DateUtils;
Date.fromString = DateUtils.dateFromString;

module.exports = {
    add: function(req, res) {
        var reqParam = req.param('song');
        if (!reqParam) {
            res.json(400, {message: 'Bad request'});
            return;
        }
        var song = JSON.parse(reqParam);

        sails.log.info('SongController/add called with song=' + song);

        song.date = Date.fromString(song.date);
        Strim.findOneBySlug(song.strim, function(err, strim) {
            
            if (strim === undefined || strim === null) return res.notFound();
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
    addArray: function(req, res) {
        var reqParam = req.param('songs');
        if (!reqParam) {
            res.json(400, {message: 'Bad request'});
            return;
        }
        if(reqParam.length === 0 ) {
            res.json(400, {message: 'Empty array'});
            return;
        }
        var result = {};
        sails.log.info('SongController/addArray ',reqParam);
        var songs = reqParam;
        var strims = Object.keys(songs);
        sails.log.info('SongController/addArray update strims',strims);
        for (var i = 0, len = strims.length; i < len; i++) {
            (function (strimName, iter) {
                Strim.findOneBySlug(strimName, function(strimErr, strim) {
                    if (strimErr || !strim) {
                        res.json({message: 'Strim not found!'}, 404);
                        return;
                    } 
                    var songsArray = songs[strimName];
                    for (var j = 0, songsLen = songsArray.length; j < songsLen; j++) {
                        ['youtube', 'youtu.be', 'vimeo', 'soundcloud'].forEach(function(domain) {
                            
                        });
                        (function (iterSong) {
                            songsArray[iterSong].strim = strim.id;
                            Song.create(songsArray[iterSong]).exec(function(songErr, saved) {
                                if(songErr) {
                                    sails.log.error('SongController/addArray error', songErr);
                                    if (!result[strimName]) {
                                        result[strimName] = {};
                                        result[strimName].error = 1;
                                    } else 
                                        result[strimName].error++;
                                } else {
                                    sails.log.info('SongController/addArray created ', JSON.stringify(saved));
                                    if (!result[strimName]) {
                                        result[strimName] = {};
                                        result[strimName].added = 1;
                                    } else 
                                        result[strimName].added++;
                                }
                            
                                if (iter == len - 1  && iterSong == songsLen - 1) {
                                    res.json(result);
                                }
                            });
                        })(j);
                    }
                    
                });
            })(strims[i], i);
        }
    },
    list: function(req, res) {
        var reqStrim = req.param('id');
        var after = req.param('after') || 0;
        after++;
        var limit = req.param('limit') || 20;
        sails.log.info('SongController/list reqStrim=%s, after=%s, limit=%s',reqStrim, after, limit);
        if (reqStrim == undefined) {
            Song.find().where({
                    id: {
                    '>': after
                    }})
                    .limit(limit)
                    .sort('date DESC')
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
        var after = req.param('after') || 0;
        var limit = req.param('limit') || 20;
        sails.log.info('SongController/listByName reqStrim=%s, after=%s, limit=%s',reqStrims, after, limit);
        var where = {};
        if (after || after != 0) {
            where = {
                id: {
                    '>': after
                }
            };
        };
        if (reqStrims == null || reqStrims == undefined) {
            sails.log.info('SongController/listByName all songs action');
            Song.find().where(where)
                    .limit(limit)
                    .sort('date DESC')
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
                    res.json({message: 'Strimow nie znaleziono'}, 404);
                    return;
                }
                var len = strims.length;
                if (len === 0 ) {
                    sails.log.warn('SongController/listByName not found songs');
                    res.json([]);
                }
                if (findQuery.or) {
                    where.or = [];
                    for( var i = 0; i < len; i++) {
                       where.or.push({strim: strims[i].id });
                    }
                } else {
                    where.strim = strims[strims.length - 1].id;
                }
                Song.find().where(where).limit(limit)
                .sort('date DESC')
                .exec(function (err, songs) {
                    if (err) {
                        sails.log.error('SongController/listByName find song  error =', err);
                        res.json(err.status);
                    } else {
                        var sonsgsLen = songs.length;
                        if (sonsgsLen === 0 ) {
                            return res.json([]);
                        }
                        songs.forEach(function (element, index) {
                            result.push(element);
                            if (index == sonsgsLen - 1) {
                                return res.json(result);
                            }
                        });
                    }
                });
                
                
            });
        
        
        }
    }
};

