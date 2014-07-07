'use strict';

/**
 * The main Sails Angular app module
 *
 * @type {angular.Module}
 */
var StrimsPlayerApi = {};
StrimsPlayerApi.LIST_STRIMS = '/api/strims/list/';
StrimsPlayerApi.LIST_SONGS_IN_STRIM = '/api/songs/list/';




var app = angular.module('app', [
        'ui.bootstrap', 
        'ngRoute'
        ]).config(['$interpolateProvider', '$routeProvider', function($interpolateProvider, $routeProvider){
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
        $routeProvider.
          when('/strim/add', {
              templateUrl: 'templates/strims/add.html',
              controller: 'StrimCtrl'
            }).
          when('/sala/', {
                templateUrl: 'alatemplates/strims/songs.html',
              controller: 'PlayerCtrl'
            }).
          when('/s/:strim', {
                templateUrl: 'templates/strims/songs.html',
              controller: 'PlayerCtrl'
            }).
          when('/strim/:strim', {
            templateUrl: 'templates/strims/songs.html',
              controller: 'PlayerCtrl'
            }).
          otherwise({
            templateUrl: 'templates/strims/songs.html',
          controller: 'PlayerCtrl'
        });
    }
]);
app.service('strimsplayer', ['$http', '$cacheFactory',
    function ($http, $cacheFactory) {
        this.lruCache = $cacheFactory('lruCache', { capacity: 10 });
        this.callApi = function (m_url, callback) {
            $http( {
                    url: m_url,
                    dataType: "json",
                    method: "GET",
                    headers: {
                    "Content-Type": "application/json; charset=utf-8"
                    },
                    cache: this.lruCache
                }).success(function(response){
                    callback(null, response);
                }).error(function(error){
                    console.log('error' + error);
                    callback(JSON.stringify(error), null);
                });
            };
        return this;
 }]);





app.controller('PlayerCtrl', ['$scope', '$http', '$routeParams','$cacheFactory','strimsplayer',
    function PlayerCtrl($scope, $http,  $routeParams,$cacheFactor, strimsplayer) {
        $scope.songs = [];
        $scope.songData = {};
        $scope.alerts = [];
        $scope.showInfo = false;



        $scope.player = videojs('video', {'techOrder': ['youtube'], 'autoplay': false, 'src': 'https://www.youtube.com/watch?v=eY49xEQGqMw'});
        $scope.player.on('next', function(e){
            $scope.activeIndex++;;
          $scope.player.playList($scope.activeIndex);
          $scope.updateActiveVideo();
          $scope.player.play();
          });
          $scope.player.on('prev', function(e){
              $scope.activeIndex--;;
              $scope.player.playList($scope.activeIndex);
              $scope.updateActiveVideo();
              $scopet.player.play();
          });
          $scope.player.on('lastVideoEnded', function(e){
            console.log('Last video has finished');
        });
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
          };
        $scope.setAlert = function(m_type, message) {
            $scope.alerts.push({type: m_type, msg: message});
            $scope.showInfo = true;
            $scope.saveApply($scope.alerts);

        }
        $scope.nextOrPrev  = function($event) {
            var clicked = $event.target;
            $scope.player[clicked.id]();
            $scope.updateActiveVideo();
            
         };
         $scope.select = function(id, $event){

          if (id != $scope.activeIndex) {
            $scope.player.playList(id);
            $scope.updateActiveVideo();
        }
            $scope.player.play();
        };
        
        $scope.updateActiveVideo = function() {
             // $scope.$apply(function () {
                 $scope.activeIndex = $scope.player.pl.current;
                 $scope.songData = $scope.songs[$scope.activeIndex];
                 $scope.saveApply($scope.activeIndex);
                 
        };
        $scope.saveApply = function(data) {
            try {
             if (!$scope.$$phase) {
                $scope.$apply();
            }
                } catch (err) {
             console.log(err);
             }
        };
        $scope.findSongs = function(strimObj) {
            var id = '';
            $scope.strimName = 'Wszystki strimy';
            if (strimObj) {
                id = strimObj.id
                $scope.strimName = strimObj.name;

            }
            strimsplayer.callApi(StrimsPlayerApi.LIST_SONGS_IN_STRIM + id , function(Songerr, songs){
                $scope.activeIndex = 0;
                if (Songerr) {
                    $scope.setAlert('danger', 'Nie znany bład!');
                    console.log('erroryy' + Songerr);
                }
                else if (!songs || songs.length == 0) {
                    $scope.setAlert('info', 'Brak muzyki!');
                   console.log('wrong songs');
                
                }
                else {
                    var parseToPlay = function(data) {
                        var result = []
                        for (var i = 0, len = data.length; i<len; i++) {
                            result.push({
                                type: 'video/youtube',
                                src: data[i].domain_url,
                                techOrder: ['youtube'],
                                title: data[i].title
                            });
                            data[i].strim = {
                                slug:  (data[i].strims_url.split('/')[2]).toLowerCase(),
                                name:  (data[i].strims_url.split('/')[2])
                            };
                        }
                        return result;
                    };
                    $scope.songData = songs[0];
                    $scope.songs = songs;
                    $scope.player.playList(parseToPlay(songs));


                    $scope.saveApply($scope.songData);
                    $scope.saveApply($scope.strimName;
                    try {
                     if (!$scope.$$phase) {
                    $scope.$apply($scope.songData);
                    $scope.$apply($scope.songs);
                    $scope.$apply($scope.player);
                    $scope.$apply($scope.strimName);
                    }
                        } catch (err) {
                     console.log(err);
                     }
                }
            });
        };
        if ($routeParams.strim) {
            strimsplayer.callApi(StrimsPlayerApi.LIST_STRIMS, function (err, strimsMenuData) {
                var strimIndex;
                    for (var i = 0,len = strimsMenuData.length; i<len; i++) {
                        if (strimsMenuData[i].slug == $routeParams.strim.toLowerCase()) {
                            strimIndex = i;
                            break;
                        }
                    }
                    if ( err) {
                        $scope.setAlert('danger', 'Nie zanleziono strima!');
                    }
                    $scope.findSongs(strimsMenuData[strimIndex]);
                
                
            });
        } else {
            $scope.findSongs(null);
        }

}]);
    


