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
    /**
     *  Add one song to given strim
     *  @param song object containg song parameter. (Model Song);
     * */
    add: function(req, res) {
        var reqParam = req.param('song');
        if (!reqParam) {
            res.json( {message: 'Bad request'}, 400);
            return;
        }
        var song = JSON.parse(reqParam);

        sails.log.info('SongController/add called with song=' + song);

        song.date = Date.fromString(song.date);
        Strim.findOneBySlug(song.strim, function(err, strim) {
            if (err) {
                return res.json(err, 500);
            }
            if (strim === undefined || strim === null)
                return res.notFound();
            song.strim = strim;
            Song.create(song).exec(function (err1, saved) {
                if(err1) {
                    sails.log.error("Error: " + err1);
                    return res.json(err1, 500);
                } else {
                    sails.log.info("Song added "  + JSON.stringify(saved));
                    res.json('ok');
                }
            });
        });
    },
    /**
     *  Add array of song to given stims
     *  @param songs its object like:
     *  {
     *      soundtrack: [
     *          { id :1 titl1: }
     *          ]
     *      80s: [ { title: 2}]
     *  }
     *  returns object containg count of added and not added songs
     * */
    addArray: function(req, res) {
        var reqParam = req.param('songs');
        if (!reqParam) {
            res.json( {message: 'Bad request'}, 400);
            return;
        }
        if(reqParam.length === 0 ) {
            res.json({message: 'Empty array'}, 400);
            return;
        }
        var result = {};
        sails.log.info('SongController/addArray ',reqParam);
        var songs = reqParam;
        var correctDomains = ['youtube.com', 'youtu.be', 'vimeo.com', 'soundcloud.com'];

        var correctDomain = false;
        var founded = false;
        var strims = Object.keys(songs);
        sails.log.info('SongController/addArray update strims',strims);

        for (var i = 0, len = strims.length; i < len; i++) {
            (function (strimName, iter) {
                Strim.findOneBySlug(strimName, function(strimErr, strim) {
                    if (strimErr || !strim) {
                        res.json( {message: 'Strim not found!'}, 404);
                        return;
                    }
                    var songsArray = songs[strimName];
                    result[strimName] = {added: 0, error: 0, incorectDomain: 0};
                    for (var j = 0, songsLen = songsArray.length; j < songsLen; j++) {
                            creating = false;
                            (function (iterSong) {
                                correctDomain = false;
                                for (var d = 0, lenDomains = correctDomains.length; d < lenDomains; d++) {
                                    if (correctDomains[d] == songsArray[iterSong].domain) {
                                        correctDomain = true;
                                        break;
                                    }
                                }
                                songsArray[iterSong].strim = strim.id;
                                if (correctDomain) {
                                    Song.create(songsArray[iterSong]).exec(function(songErr, saved) {
                                        creating = true;
                                        if(songErr) {
                                            sails.log.error('SongController/addArray error', songErr);
                                            result[strimName].error++;
                                        } else {
                                            sails.log.info('SongController/addArray created ', JSON.stringify(saved));
                                            result[strimName].added++;
                                        }
                                        if (iter == len - 1  && iterSong == songsLen - 1) {
                                            res.json(result);
                                            return;
                                        }
                                    });
                                } else {
                                    result[strimName].incorectDomain++;
                                    if (iter == len - 1  && iterSong == songsLen - 1 && !creating) {
                                        res.json(result);
                                        return;
                                    }
                                }
                            })(j);

                    }

                });
            })(strims[i], i);
        }
    },
    /* List songs in strims by strim name
     * it can concat two and more strims
     * */
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
        if (reqStrims === null || reqStrims === undefined) {
            sails.log.info('SongController/listByName all songs action');
            Song.find().where(where)
                    .limit(limit)
                    .sort('date DESC')
                    .exec(function (err, songs) {
                        if (err) {
                            sails.log.error('SongController/listByName all songs action error', err);
                            res.json({message: err.message}, err.status);
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
                        res.json({message: err.message}, err.status);
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

