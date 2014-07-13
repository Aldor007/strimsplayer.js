/**
 * StrimyController
 *
 * @description :: Server-side logic for managing strimies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var request = require('request');

module.exports = {
    get: function (req, res) {
        var name = req.param('name').toLowerCase();
        if (name) {
            res.redirect('/#!s/'+ name);
        } else {
        
            res.redirect('/');
        }

    },
    list: function (req, res) {
        sails.log.info('StrimController/list called')
        Strim.find().sort('name desc').exec(function (err, strims) {
            if (err) {
                sails.log.error('StrimController/list error=' + JSON.stringify(err));
                return res.send(500);
            } else {
                res.json(strims);
            }

        
        });
    
    },
    add: function (req, res) {
        var saveStrim = function(strimName) { 
            Strim.create({name: strimName}).exec(function(err, strim){
                if(err) {
                    sails.log.error('StrimyController/add error', err);
                    return res.json({status: 'error', message: 'Strim istnieje!'}, err.status);
                } else {
                    console.info('StrimyController/add 200 added strim  strimName=' + strimName);
                    request({url: 'http://' + sails.config.cliapi.HostAndPORT + '/songscollectorfromstrim/'+ strimName}, function(errorUpdate, response, body) {
                        if (errorUpdate) {
                            sails.log.error('StrimController/add error updating songs ', errorUpdate);
                        } else {
                            sails.log.info('StrimController/add added songs', body);
                        }

                             
                    });
                    res.json({status: 'ok', message: 'Strim ' + strim + 'dodany'},200);
                }

            });
        };

        var strimName = req.param('name');
        sails.log.info('StrimController/add called with strimName=' + strimName);
        var errorRes = {};
        request( {url:'http://strims.pl/s/'+strimName + '?filtr=video',
                    followRedirect: false,
                    timeout: 500
                }, function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                        if (body.indexOf('<p>Nie znaleziono treści.</p>') === -1) {
                            saveStrim(strimName);
                        }
                        else {
                            errorRes.message = "Nie znaleziono filmów na "+ strimName;
                            console.info('StrimController/add 404 Not propert strim  strimName=' + strimName);
                            res.json(errorRes, 404)
                        }
                    } else {
                    
                            errorRes.message = "Nie znaleziono strimu o nazwie "+ strimName;
                            console.info('StrimController/add 404 Not Found strim with strimName=' + strimName);
                            res.json(errorRes, 404)
                    }

                });
        
    },
	
};

