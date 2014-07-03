/**
 * StrimyController
 *
 * @description :: Server-side logic for managing strimies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    get: function (req, res) {
        var name = req.query.name;
        if (!name) {
            res.notFound();
            return;
        }
        Strim.findOneByName(name, function(err, strim) {
            
            if (strim === undefined) return res.notFound();
            if (err) return next(err);

            res.json(strim);
        
        
        });
    },
    list: function (req, res) {
        Strim.find().exec(function (err, strims) {
            if (err) {
                return res.send(500);
            } else {
                res.json(strims);
            }

        
        })
    
    }
	
};

