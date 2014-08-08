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
]).directive('doScroll', function() {
    return function(scope, element, attrs) {
        var offset;
        var parent;
        console.log(attrs.isActive);
        scope.$watch(attrs.isActive, function(newVal, oldVal) {
            //console.log(element);
            //console.log(val);
        })

        if (element.hasClass(".active")) {
            console.log("selected:",element);
            offset = element.position().top;
            parent = element.parent();
            console.log(parent);
            console.log(offset);
            parent.css({"margin-top": - offset});
        }
        if (scope.$last){
            console.log("last:",element);

        }
    };
});
