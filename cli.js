#!/usr/bin/env node
var argv = require('yargs')
    .usage('strimsplayer cli.\nUsage: $0')
    .example('$0 collectsongs', 'start song collect')
    .alias('l', 'listen')
    .string('l')
    .describe('l', 'host:port on what i have to listen for information')
    .argv;
var ApiServer = require('./lib/ApiServer.js').ApiServer;
var StrimsAPI = require('./lib/StrimsAPI.js').StrimsAPI;
var StrimsPlayerAPI = require('./lib/StrimsPlayerAPI.js').StrimsPlayerAPI;
var SongsCollector = require('./lib/SongsCollector.js').SongsCollector;
var SongsCollectorFromStrim = require('./lib/SongsCollectorFromStrim.js').SongsCollectorFromStrim;
var DomainFiltr = require('./lib/DomainFiltr.js').DomainFiltr;

var domainsList = ['youtube.com', 'vimeo.com', 'soundcloud.com', 'youtu.be'];

var filtr = new  DomainFiltr(domainsList, DomainFiltr.ACTIONS.LEAVE);
if (argv.listen) {
    var hostAndPort = argv.listen.split(':');
    var CliApi = new ApiServer(hostAndPort[0], hostAndPort[1]);
    var strimsapi = new StrimsAPI(null, filtr);
    var strimsplayer = new StrimsPlayerAPI('http://localhost:1337');
    CliApi.addAction(new SongsCollector(strimsplayer, strimsapi));
    CliApi.addAction(new SongsCollectorFromStrim(strimsplayer, strimsapi));
    CliApi.listen();
}

if (argv._[0] == 'collectsongs'){
    var strimsapi = new StrimsAPI(null, filtr);
    var strimsplayer = new StrimsPlayerAPI('http://127.0.0.1:1337');
    var collect = new SongsCollector(strimsplayer, strimsapi);
    collect.execute(function (err, ok) {
        if (err) {
            console.error('SongCollect error', err.message);
            process.exit(-1);
        } else {
        
            console.info('SongCollect ok', JSON.stringify( ok));
        }

    
    });
} else {
    console.error('Unknow options');
}

