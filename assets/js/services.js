'use strict';
app.service('strimsplayer', ['$http', '$cacheFactory',
    function ($http, $cacheFactory) {
        this.API = {
            LIST_STRIMS: '/api/strims/list/',
            LIST_SONGS_IN_STRIM:'/api/songs/list/',
            LISTBYNAME_SONGS_IN_STRIM:'/api/songs/listbyname/',
            ADD_STRIM:  '/api/strims/add/'
        };

        this.lruCache = $cacheFactory('lruCache', { capacity: 10 });
        this.after = 0;

        this.getCsrf = function(callback) {
            $http.get('/csrfToken').success(function (response) {
                callback(null, response._csrf);
            }).error(function(error) {
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
                    cache: this.lruCache || true
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
               $http(httpOptions).success(function(response) {
                   var tmpAfter = that.after;
                   if (options.paginate && response.length > 0) {
                       var maxId = 0;
                       var len = response.length;
                       for (var i= 0;  i <len; i++)
                            if (response[i].id > maxId)
                                maxId = response[i].id;
                        that.after = maxId;
                   }
                    callback(null, response, tmpAfter);

                }).error(function(error) {
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
                        console.error('strimsplayerApi error status code ' + error.status);
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
        if (msg instanceof Object) {
            msg = msg.message || msg;
        }
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

app.factory("songData", function () {
    var bindable = null;
    return {
        info: bindable
    }
});
