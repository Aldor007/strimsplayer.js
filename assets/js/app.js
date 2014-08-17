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


