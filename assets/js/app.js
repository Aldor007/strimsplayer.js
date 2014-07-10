'use strict';

/**
 * The main Sails Angular app module
 *
 * @type {angular.Module}
 */
var StrimsPlayerApi = {};
StrimsPlayerApi.LIST_STRIMS = '/api/strims/list/';
StrimsPlayerApi.LIST_SONGS_IN_STRIM = '/api/songs/list/';
StrimsPlayerApi.ADD_STRIM = '/api/strims/add/';



var saveApply = function ($scope, data) {
    try {
     if (!$scope.$$phase) {
        $scope.$apply(data);
    }
        } catch (err) {
     console.log(err);
     }
};




var app = angular.module('app', [
        'ui.bootstrap', 
        'ngRoute',
        'infinite-scroll'
        ]).config(['$interpolateProvider', '$routeProvider', function($interpolateProvider, $routeProvider){
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
        $routeProvider.
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
        this.after = 0;
        this.getCsrf = function(callback) {
            $http.get('/csrfToken').success(function(response){
                    callback(null, response._csrf);
                }).error(function(error){
                        console.error('strimsplayerApi error ' + error.message);
                        callback(error, null);
                        
                });
        
        };
        this.callApi = function (options, callback) {
            if (options.paginate) {
                options.url += '?after=' + this.after;
            }
            var httpOptions = {
                    url: options.url,
                    dataType: "json",
                    method: options.method || 'GET',
                    cache: this.lruCache
            };
            if (options.data) {
                httpOptions.data = options.data;
            }
            var that = this;
           var _callApi = function (tokenError, csrfToken) {
               if (tokenError || csrfToken == null) {
                   callback("Bład serwera", null);
               }
               httpOptions.headers =  {
                    "Content-Type": "application/json; charset=utf-8",
                    "X-CSRF-Token": csrfToken
                };
               $http(httpOptions).success(function(response){
                   var tmpAfter = that.after;
                   if (options.paginate && response.length > 0) {
                        that.after = response[response.length - 1].id;
                   }
                    callback(null, response, tmpAfter);
                }).error(function(error){
                    if (error.message) {
                        console.error('strimsplayerApi error ' + error.message);
                        callback(error.message, null);
                        
                    }
                    else if (error.status == 404){
                        console.error('strimsplayerApi error status code ' + error.status);
                        callback('Nie znalzeiono', null);
                    } else if (error.status == 500) {
                        console.error('strimsplayerApi error status code ' + error.status);
                        callback('Bład serwera', null);
                    }
                    else {
                        callback('Nieznany bład', null);
                    }

                });
            };
          _callApi(null, 'token2');
          // this.getCsrf(_callApi);
            };
        return this;
 }]);

app.factory('alertService',['$rootScope',
        function($rootScope) {
    var alertService = {
        SERVER_ERROR: 'Nieznany błąd!',
        UNKNOW_EROR: 'Coś poszło nie tak',
        NO_SONGS: 'Brak muzyki!',
        
        
    
    };


    // create an array of alerts available globally
    $rootScope.alerts = [];
    $rootScope.showInfo = false;

    alertService.setAlert = function(type, msg) {
        var obj = {'type': type, 'msg': msg};
         for (var i = 0, len = $rootScope.alerts.length; i < len; i++) {
            if ($rootScope.alerts[i].msg == obj.msg) {
               console.error("This alert is in front!");
               return true;
             }
        }
        $rootScope.alerts.push(obj);
        $rootScope.showInfo = true;
        saveApply($rootScope, $rootScope.alerts);
    };

    alertService.closeAlert = function(index) {
        $rootScope.alerts.splice(index, 1);
        saveApply($rootScope, $rootScope.alerts);
        };
    alertService.reset = function() {
        $rootScope.alerts = [];
        $rootScope.showInfo = false;
    }
    

    return alertService;
}]);



app.controller('PlayerCtrl', ['$scope','$window',  '$routeParams','$cacheFactory','strimsplayer', 'alertService',
    function PlayerCtrl($scope,$window, $routeParams,$cacheFactor, strimsplayer, alertService) {
        $scope.songs = [];
        $scope.songData = {};
        $scope.currentStrim = {};
        $scope.currentStrim.name = "aaaaaaaaaaaf - - ";
        $scope.thereAreMoreSongs = true;
        


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
          $scope.player.on('error', function(event) {
              var messages = {
                    // MEDIA_ERR_ABORTED
                    1: "The video download was cancelled",
                    // MEDIA_ERR_NETWORK
                    2: "The video connection was lost, please confirm you're connected to the internet",
                    // MEDIA_ERR_DECODE
                    3: "The video is bad or in a format that can't be played on your browser",
                    // MEDIA_ERR_SRC_NOT_SUPPORTED
                    4: "This video is either unavailable or not supported in this browser",
                    // MEDIA_ERR_ENCRYPTED (Chrome)
                    5: "The video you're trying to watch is encrypted and we don't know how to decrypt it",
                    unknown: "An unanticipated problem was encountered, check back soon and try again"
              };
               var code, dialog, player;
                code = event.target.error ? event.target.error.code : event.code;
               alertService.setAlert('danger', messages[code] || messages['unknown']);
          });
          $scope.player.on('lastVideoEnded', function(e){
            console.log('Last video has finished');
            $scope.getMoreSongs();
        });
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
            
            saveApply($scope, data);
            // try {
            // if (!$scope.$$phase) {
            //     $scope.$apply(data);
            // }
            // } catch (err) {
            //     console.log(err);
            // }
        
        };
        $scope.findSongs = function(strimObj) {
            var id = '';
            $scope.strimName = 'Wszystkie strimy';
            if (strimObj) {
                id = strimObj.id
                $scope.strimName = strimObj.name;
                    $scope.saveApply($scope.strimName);
            }
            if ($scope.thereAreMoreSongs)
            strimsplayer.callApi({url: StrimsPlayerApi.LIST_SONGS_IN_STRIM + id, paginate: true, method: 'POST'} , function(Songerr, songs, after){
                $scope.activeIndex = 0;
                if (Songerr) {
                    alertService.setAlert('danger', alertService.SERVER_ERROR);
                    console.log('Error ' + Songerr);
                }
                else if (!songs || songs.length == 0 && after == 0) {
                    alertService.setAlert('info', alertService.NO_SONGS);
                
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
                    if (after == 0) {
                        $scope.songs = songs;
                        $scope.player.playList(parseToPlay(songs));
                        var width = document.getElementById('video').parentElement.offsetWidth;
                        $scope.player.width(width).height(width * 9/16);
                    } else {
                        if (songs.length == 0 ) {
                            $scope.thereAreMoreSongs = false;
                        }
                        for (var i = 0; i < songs.length; i++)
                             $scope.songs.push(songs[i]);
                        $scope.player.addVideosEx(parseToPlay(songs));
                    }
                    
                    $scope.saveApply($scope.songData);
                    $scope.saveApply($scope.strimName);
                    $scope.saveApply($scope.songs);
                    $scope.saveApply($scope.player);
                    
                    // try {
                    //  if (!$scope.$$phase) {
                    // $scope.$apply($scope.songData);
                    // $scope.$apply($scope.songs);
                    // $scope.$apply($scope.player);
                    // $scope.$apply($scope.strimName);
                    // }
                    //     } catch (err) {
                    //  console.log(err);
                    //  }
                }
            });
        };
        $scope.getMoreSongs = function() {
            if ($routeParams.strim) {
                if( $routeParams.strim.toLowerCase() != $scope.currentStrim.name.toLowerCase()) {
                    $scope.currentStrim.name = 'sdfkj sdfijsdifjsdkl jfsdkj fklsdjfk';
                    strimsplayer.after = 0;
                    $scope.thereAreMoreSongs = true;
                    alertService.reset();
                }
                if($scope.currentStrim.id) {
                    $scope.findSongs($scope.currentStrim)
                }
                else {
                    strimsplayer.callApi( {url: StrimsPlayerApi.LIST_STRIMS}, function (err, strimsMenuData) {
                        var strimIndex = null, len = strimsMenuData.length;
                            for (var i = 0;  i<len; i++) {
                                if (strimsMenuData[i].slug == $routeParams.strim.toLowerCase()) {
                                    strimIndex = i;

                                    break;
                                }
                            }
                            if ( err || strimIndex == null)  {
                                alertService.setAlert('danger', 'Nie zanleziono strima!');
                            } else {
                            $scope.currentStrim = strimsMenuData[strimIndex];
                            $scope.findSongs(strimsMenuData[strimIndex]);
                            }
                        
                    });
                }
            } else {
                $scope.findSongs(null);
            }
        };

}]);
    

app.controller('DropdownCtrl', ['$scope',  'strimsplayer', 'alertService',
    function DropdownCtrl($scope, strimsplayer, alertService) {
    strimsplayer.callApi( {url: StrimsPlayerApi.LIST_STRIMS}, function (err, strimsMenuData) {
        if (err) {
            alertService.setAlert('danger', alertService.UNKNOW_EROR);
            
        }
        if (!strimsMenuData || strimsMenuData.length == 0) {
            alertService.setAlert('danger', alertService.UNKNOW_EROR);
        }
        $scope.strims = strimsMenuData;
        saveApply($scope, $scope.strims);
    });
    // $scope.isCollapsed = false;
    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
    };
}]);

app.controller('RootCtrl', ['$rootScope', 'alertService',
    function ($rootScope, alertService) {
        $rootScope.closeAlert = alertService.closeAlert;    
    
    
}]);

app.controller('FormCtrl', ['$scope', '$http', 'strimsplayer', 'alertService',
    function($scope, $http,  strimsplayer, alertService) {
        
        $scope.submitForm = function(isValid) {
            if(isValid) {
                strimsplayer.callApi( {
                        url: StrimsPlayerApi.ADD_STRIM, 
                        method: "POST", 
                        data: {name: $scope.strimForm.name.$modelValue}
                }, function(err, response) {
                    if (err) {
                        return alertService.setAlert('danger', err);
                    }
                    alertService.setAlert('info', 'Strim dodany!');
                });
                
            }
        };
    
}]);

