var Crawler = require("crawler").Crawler;
var http = require('http');
var unirest = require('unirest');
var moment = require('moment');


var DataHelper = function(indate) {
        // indate = indate.replace("dzisiaj", (date.today()).strftime('%d %m %Y '));
        // indate = indate.replace("wczoraj", (date.today()-timedelta(1)).strftime(('%d %m %Y')));


        indate = indate.replace('stycznia', '01');
        indate = indate.replace('lutego', '02');
        indate = indate.replace('marca', '03');
        indate = indate.replace('kwietnia', '04');
        indate = indate.replace('maja',  '05');
        indate = indate.replace('czerwca', '06');
        indate = indate.replace('lipca', '07');
        indate = indate.replace('sierpnia', '08');
        indate = indate.replace('września', '09');
        indate = indate.replace('pażdziernika', '10');
        indate = indate.replace('listopda', '11');
        indate = indate.replace('grudnia', '12');
        indate = indate.replace(' ', '-');
        indate = indate.replace(' ', '-');

        indate = moment(indate, 'm-D-YYYY HH:mm:ss');
        return indate;
};

var options = {
    host: 'localhost',
    port: 1337,
    path: '/api/strims/list',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'User-Agent':'nodejs',
        'X-Info': 'strimsplayer.pl'
    }

};
var test = function (data, $ ) {
    var html = $(data).html();
    var jquery = $(html);
    var song = {};
    song.upvotes = jquery.find('a.like>span.content_vote_count').text();
    song.downvotes =   jquery.find('a.dislike>span.content_vote_count').text();
    song.date = DataHelper(jquery.find('ul.content_info>li>span>a>span').attr('title'));
    song.strims_url = jquery.find('ul.content_info>li>span>a').attr('href');
    song.domain = jquery.find('h2>span>a').text();
    song.user =     jquery.find('.link').text();
    song.domain_url = jquery.find('h2 a.content_title').attr('href');
    song.title = jquery.find('h2 a.content_title').text();
    song.strim = (song.strims_url.split('/')[2]).toLowerCase();
    // unirest.get('http://localhost:1337/csrfToken').end(function (csrfTokenJSON) {
        // var csrfToken = csrfTokenJSON.body;
        unirest.post('http://localhost:1337/api/songs/add')
        .headers({ 'Accept': 'application/json'/*, 'X-CSRF-Token': csrfToken._csrf*/ })
        .send( { song:JSON.stringify(song)})
        .end( function(res) {
            console.info("Response " + JSON.stringify(res.body) + "res status " + res.status);
        });

    // });



};

var work = function (strims) {
    var crawl = new Crawler({
        "maxConnections": 20,
        "callback": function (error, result, $) {
            // console.log(result);
            var content = [];

// #contents_page > div.column_center > div > ul > li:nth-child(1)
               $.each($("div#contents_page>div.column_center>div.column_inner>ul>li>div"), function(index, song) {
                       content.push(song);        
                       // song.
                       // song.
                       test(song, $);

               });

        }
    });
    strims = JSON.parse(strims);
    console.log(strims);
    strims.forEach(function (strim) {
        var url = 'http://strims.pl/s/' + strim.slug;
        console.log("url = "  + url);
        crawl.queue(url);
    });
};



var reqGet = http.request(options, function(res) {
    var strimsList = '';
    res.on('data', function(data) {
        strimsList += data;
    });
    res.on('end', function(data) {
        work(strimsList);
    });
});
reqGet.on('error', function(err) {
    console.error("error:  + " + err);

});
reqGet.end();
