var url = require("url");
var http = require('http');

var ApiServer = function(host, port, actions) {
    this.actions = actions || [];
    this.host = host;
    this.port = port;
    var that = this;
    this.server = http.createServer(function (req, res) {
        that._routing(req, res);
        
    });

};
ApiServer.prototype.addAction = function (action) {
    this.actions.push(action);
};
ApiServer.prototype.listen = function(host, port) {
    this.server.listen(port || this.port, host || this.host);
};

ApiServer.prototype._routing = function(req, res) {
    var len = this.actions.length;
    var founded  = false;
    var responseData = {};
    var that = this;
    for (var i = 0, len = this.actions.length; i < len; i++) {
        var actionName = url.parse(req.url).pathname;
        if (actionName.indexOf('/') !== -1) {
            actionName = actionName.split('/')[1];
        }
        (function(iter) {
            var action = that.actions[iter];
            console.log('ApiServer: actionName=', actionName);
            if (action.getName().toLowerCase() == actionName.toLowerCase()) {
                founded = true;
                console.log('ApiServer: Executing ', action.getName());
                action.setRequest(req);
                action.execute(function (err, data) {
                    console.log('ApiServer: Execute end, error=%s body=%s', err, data);
                    if (err) {
                        responseData.status = err.status;
                        responseData.body = err.message;
                    } else {
                        responseData.status = 200;
                        responseData.body = data;
                    }
                    res.writeHead(responseData.status, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(responseData.body));
                });
                ;
            } else {
                responseData.status = 404;
                responseData.body = {message: 'Unknow Method'};
            }
            if (iter === len -1 && !founded ) {
                res.writeHead(responseData.status, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(responseData.body));
                
            }
        })(i);
     }

};

exports.ApiServer = ApiServer;
