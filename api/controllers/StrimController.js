/**
 * StrimyController
 *
 * @description :: Server-side logic for managing strimies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    get: function (req, res) {
        var name = req.param('name').toLowerCase();
        if (!name) {
            res.notFound();
            return;
        }
        Strim.findOneBySlug(name, function(err, strim) {
            
            if (strim === undefined) return res.notFound();
            if (err) return next(err);

            res.view( {strim: strim});
        
        
        });
    },
    list: function (req, res) {
        Strim.find().exec(function (err, strims) {
            if (err) {
                return res.send(500);
            } else {
                res.json(strims);
            }

        
        });
    
    }
	
};

