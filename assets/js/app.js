'use strict';

/**
 * The main Sails Angular app module
 *
 * @type {angular.Module}
 */
var app = angular.module('app', [
        'ui.bootstrap' ]).config(function($interpolateProvider){
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
    }
    );


