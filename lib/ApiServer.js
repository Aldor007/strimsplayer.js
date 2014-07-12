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
    this.actions.forEach(function(action) {
        var actionName = url.parse(req.url).pathname;
        if (actionName.indexOf('/') !== -1) {
            actionName = actionName.split('/')[0];
        }
        if (action.getName().toLowerCase() === actionName.toLowerCase()) {
            console.info('ApiServer: Executing ', action.getName());
            action.setRequest(req);
            action.execute(function (err, data) {
                if (err) {
                    res.writeHead(err.status, {'Content-Type': 'application/json'});
                    res.end(err.message);
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(data);
                }

            });
        }

    });
};

exports.ApiServer = ApiServer;
