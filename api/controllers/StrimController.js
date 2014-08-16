/**
 * StrimyController
 *
 * @description :: Server-side loogic for strim
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var request = require('request');

module.exports = {
    get: function (req, res) {
        var name = req.param('name');
        if (name) {
            res.redirect('/#!s/'+ name);
        } else {
            res.redirect('/');
        }
    },
    list: function (req, res) {
        sails.log.info('StrimController/list called');
        Strim.find().sort('name ASC').exec(function (err, strims) {
            if (err) {
                sails.log.error('StrimController/list error=' + JSON.stringify(err));
                return res.json({message: 'DB error'}, err.status || 500);
            }
            res.json(strims);

        });
    },
    add: function (req, res) {
        var saveStrim = function(strimName) {
            Strim.create({name: strimName}).exec(function(err, strim) {
                if(err) {
                    sails.log.error('StrimyController/add error', err);
                    return res.json({status:  err.status, message: 'Strim istnieje!'}, err.status);
                }
                sails.log.info('StrimyController/add 200 added strim  strimName=' + strimName);
                request({url: 'http://' + sails.config.cliapi.HostAndPORT + '/songscollectorfromstrim/'+ strimName}, function(errorUpdate, response, body) {
                    if (errorUpdate) {
                        sails.log.error('StrimController/add error updating songs ', errorUpdate);
                    } else {
                        sails.log.info('StrimController/add added songs', body);
                    }
                });
                res.json({status: 200, message: 'Strim ' + strimName + 'dodany'}, 200);


            });
        };
        var strimName = req.param('name');
        sails.log.info('StrimController/add called with strimName=' + strimName);
        var errorRes = {};
        request( {url:'http://strims.pl/s/'+strimName.toLowerCase() + '?filtr=video',
                    followRedirect: false,
                    timeout: 1000
                }, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        if (body.indexOf('<p>Nie znaleziono treści.</p>') === -1) {
                            saveStrim(strimName);
                        }
                        else {
                            errorRes.message = "Nie znaleziono filmów na "+ strimName;
                            sails.log.info('StrimController/add 404 Not propert strim  strimName=' + strimName);
                            res.json(errorRes, 404);
                        }
                    } else {
                        if (error) {
                            sails.log.info('StrimController/add 504 strims.pl timeout strim=' + strimName);
                            errorRes.message = "Strims.pl nie odpowiedział w czasie.";
                            errorRes.status  = 504;
                        } else {
                            errorRes.message = "Nie znaleziono strimu o nazwie "+ strimName + " na strims.pl";
                            sails.log.info('StrimController/add 404 Not Found strim with strimName=' + strimName);
                            sails.log.info('StrimController/add strimspl status = ' + response.statusCode);
                            errorRes.status = 404;
                        }
                        res.json(errorRes, errorRes.status);
                    }

                });
    },
};

