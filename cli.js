var Crawler = require("crawler").Crawler;
var http = require('http');

var options = {
    host: 'localhost',
    port: 1337,
    path: '/strim/list',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'User-Agent':'nodejs'
    }

};
var test = function (data, $ ) {
    var html = $(data).html();
    var jquery = $(html);
    var upvotes = jquery.find('a.like>span.content_vote_count').text();
    var downvotest =   jquery.find('a.dislike>span.content_vote_count').text();
    var date = new Date(jquery.find('ul.content_info>li>span>a>span').attr('title'));
    var strims_url = jquery.find('ul.content_info>li>span>a').attr('href');
    var domain = jquery.find('h2>span>a').text();
    var user =     jquery.find('.link').text();
    var yt_url = jquery.find('h2 a.content_title').attr('href');
    var title = jquery.find('h2 a.content_title').text();

    var save_options = {

    
    };
    // console.log($(data).find('a.user_name span').val());
    process.exit(0);

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
