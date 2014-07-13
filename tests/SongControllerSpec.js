// var  Sails = require('sails');
var SongController = require('../api/controllers/SongController.js');
var Song = require('../api/models/Song.js');
// var barrels = require('barrels');
// var fixtures;

describe('SongsController', function() {
    var request;
    var response;
    beforeEach(function() {
        GLOBAL.Song = jasmine.createSpy('Strm');
        GLOBAL.sails = jasmine.createSpy('sails');
        GLOBAL.sails.log = jasmine.createSpy('sails');
        ['info', 'error', 'warn'].forEach(function (name) {
            GLOBAL.sails.log[name] = jasmine.createSpy('sails' + name);
        });
        GLOBAL.Strim = jasmine.createSpy('Strim');
        request = jasmine.createSpy('request');
        response = jasmine.createSpy('response');
        response.json = jasmine.createSpy('response.json');
        response.send = jasmine.createSpy('response.send');
        response.notFound = jasmine.createSpy('response.notFound');
        request.param = jasmine.createSpy('request.param');
    });
    describe('SongController.add', function() {
        it('should return 400 if no params', function() {
            request.param.andReturn(null);
            SongController.add(request, response);
            expect(response.json).toHaveBeenCalled();
        });
        it('should return 404 strim not found', function() {
            var given =  {
                strim: 'test',
                date: '1-JAN-2014 17:00',
            };
            request.param.andReturn(JSON.stringify(given));
            GLOBAL.Strim.findOneBySlug = jasmine.createSpy('Strim.findOneBySlug').andCallFake(function (slug, callback) {
                expect(slug).toBe(given.strim);
                callback(null, null);
            });
            SongController.add(request, response);
            expect(response.json).not.toHaveBeenCalled();
            expect(response.notFound).toHaveBeenCalled();
        });

    });

    describe('SongController.addArray', function() {
        
    });

});
