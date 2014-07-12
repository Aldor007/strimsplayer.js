var DateUtils = require('./DateUtils.js').DateUtils;
var Crawler = require("crawler").Crawler;
var path = require('path');

var StrimsAPI = function (url) {
    this.url = url || 'http://strims.pl';

};

StrimsAPI.prototype.getStrim = function(url) {


};
/** Crawrl given list of strims and get content of it
 * @param  array contains strims to crawl
 * @callback function to call on end of crawl
 */
StrimsAPI.prototype.getContentOfArrayOfStrims = function(strims, callback) {
    var that = this;
    var contentList = {};
    var crawler = new Crawler({
        'maxConnections': 20,
        'callback': function (error, result, $) {
            if (error) {
                console.error('StrimsAPI/getContentOfStrims crawler error', error);
            }
            // $.each($(StrimsAPI.CRAWLER.CONTENT), function(index, data) {
            $.each($(StrimsAPI.CRAWLER.CONTENT), function(index, data) {
                that._parseContent(data, $,function (content) {
                    if (contentList[content.strim]) {
                        contentList[content.strim].push(content);
                    } else {
                        contentList[content.strim] = [];
                        contentList[content.strim].push(content);
                    }
                });
            });

        },
        'onDrain': function() {
            callback(null, contentList);
        },
        'userAgent': 'strimsapi-crawler'
    });
    strims.forEach(function (strim) {
        var url = that.url +  path.join( '/s/', strim);
        console.log("url = "  + url);
        crawler.queue(url);
    });

};
StrimsAPI.prototype._parseContent = function(content, $, callback) {
    var html = $(content).html();
    var jquery = $(html);
    var data = {};
    data.upvotes = jquery.find(StrimsAPI.CRAWLER.UPVOTES).text();
    data.downvotes =   jquery.find(StrimsAPI.CRAWLER.DOWVOTES).text();
    data.date = DateUtils.dateFromString(DateUtils.parseDate(jquery.find(StrimsAPI.CRAWLER.DATE).attr('title')));
    data.strims_url = jquery.find(StrimsAPI.CRAWLER.STRIMS_URL).attr('href');
    data.domain = jquery.find(StrimsAPI.CRAWLER.DOMAIN).text();
    data.user =     jquery.find(StrimsAPI.CRAWLER.USER).text();
    data.domain_url = jquery.find(StrimsAPI.CRAWLER.DOMAIN_URL).attr('href');
    data.title = jquery.find(StrimsAPI.CRAWLER.TITLE).text();
    data.strim = (data.strims_url.split('/')[2]).toLowerCase();

    callback(data);

};
StrimsAPI.CRAWLER = {};
StrimsAPI.CRAWLER.CONTENT = 'div#contents_page>div.column_center>div.column_inner>ul>li>div';
StrimsAPI.CRAWLER.UPVOTES = 'a.like>span.content_vote_count';
StrimsAPI.CRAWLER.DOWVOTES = 'a.dslike>span.content_vote_count';
StrimsAPI.CRAWLER.DATE = 'ul.content_info>li>span>a>span';
StrimsAPI.CRAWLER.STRIMS_URL = 'ul.content_info>li>span>a';
StrimsAPI.CRAWLER.DOMAIN = 'h2>span>a';
StrimsAPI.CRAWLER.USER = '.link';
StrimsAPI.CRAWLER.DOMAIN_URL = 'h2 a.content_title';
StrimsAPI.CRAWLER.TITLE = 'h2 a.content_title';

exports.StrimsAPI = StrimsAPI;
